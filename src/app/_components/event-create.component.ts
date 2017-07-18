import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { StatesHelper } from '../_helpers/states-helper';
import { SearchService } from '../_services/search.service';
import { CategoryService } from '../_services/category.service';
import { Event } from '../_models/event';
import { Venue } from '../_models/venue';
import { Page } from '../_models/page';
import { EventService } from '../_services/event.service';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import * as moment from 'moment-timezone'; // add this 1 of 4
// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

declare var google:any;

class DateTime {
  private _dateTime = new moment().tz('America/Los_Angeles');
  private _timezoneId = 'America/Los_Angeles'; //default
  get date() {
    return this._dateTime;
  }
  set date(newDate){
    let year = newDate.getFullYear();
    let month = newDate.getMonth();
    let date = newDate.getDate();
    this._dateTime.year(year).month(month).date(date);
  }
  get time() {
    return this._dateTime.format('HH:mm');
  }
  set time(newTime) {
    let timeArray = newTime.split(':');
    let hours = timeArray[0];
    let minutes = timeArray[1];
    this._dateTime.hours(hours).minutes(minutes);
  }
  get timezone() {
    return this._dateTime.format('z');
    //return this.dateTime.tz.name;
  }
  set timezone(newTimezone:string) {
    this._dateTime.tz(newTimezone);
    this._timezoneId = newTimezone;
  }
  get timezoneId() {
    return this._timezoneId;
  }
}

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./modal.component.css','./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  categories = [];
  event = new Event();
  venue:Venue;
  startDateTime = new DateTime();
  tempVenue:Venue; //used for creating a custom venue
  participants = [];
  tempParticipant:Page;
  states = StatesHelper.states;
  venueModalVisible = false;
  timezoneModalVisible = false;
  participantModalVisible = false;
  private searchVenueTerms = new Subject<string>();
  private searchParticipantTerms = new Subject<string>();
  venueResults: Observable<any[]>;
  participantResults: Observable<any[]>;
  geocoder:any;
  venueGeocodeResults = [];
  resultMapping:{[k: string]: string} = {'=0': '0 results.', '=1': '1 result.', 'other': '# results.'};
  venueResultError = false;
  @ViewChild('participantSearch') participantSearch: ElementRef;
  @ViewChild('venueSearch') venueSearch: ElementRef;
  tempTimezone:string;
  timezones = [
    {'id':'Pacific/Honolulu', 'name'  : 'Hawaii-Aleutian Standard Time (HAST)'},
    {'id':'America/Anchorage', 'name' : 'Alaska with Daylight Savings Time (AKDT)'},
    {'id':'PST8PDT', 'name'           : 'Pacific with Daylight Savings Time (PDT)'},
    {'id':'MST', 'name'               : 'Mountain Standard Time (Arizona) (MST)'},
    {'id':'MST7MDT', 'name'           : 'Mountain with Daylight Savings Time (MDT)'},
    {'id':'CST6CDT', 'name'           : 'Central with Daylight Savings Time (CDT)'},
    {'id':'EST5EDT', 'name'           : 'Eastern with Daylight Savings Time (EDT)'}
  ];

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location,
    private searchService: SearchService,
    private _ngZone: NgZone,
    private categoryService: CategoryService
  ){
    this.event.startTime = '20:00';
    this.event.startDate = moment();
  }

  ngOnInit():void {
    //Google map stuff
    this.geocoder = new google.maps.Geocoder;
    //Get categories
    this.getCategories();
    //live search for venues
    this.initVenueSearch();
    //live search for participants
    this.initParticipantSearch();
  }

  private initVenueSearch(){
    this.venueResults = this.searchVenueTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.searchService.searchVenues(term)
        // or the observable of empty results if there was no search term
        : Observable.of<any[]>([]))
      .catch(error => {
        // TODO: add real error handling
        return Observable.of<any[]>([]);
      });
  }

  private initParticipantSearch(){
    this.participantResults = this.searchParticipantTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.searchService.searchParticipants(term)
        // or the observable of empty results if there was no search term
        : Observable.of<any[]>([]))
      .catch(error => {
        // TODO: add real error handling
        return Observable.of<any[]>([]);
      });
  }

  searchVenues(term: string): void {
    this.searchVenueTerms.next(term);
  }
  searchParticipants(term: string): void {
    this.searchParticipantTerms.next(term);
  }

  public chooseVenue(venue: any){
    this.venue = Venue.map(venue);
    this.venueModalVisible = false;
    this.initVenueSearch(); //clear out results
  }

  public chooseParticipant(participant: any){
    /*
    this.participants.push(Page.map(participant));
    this.participantModalVisible = false;
    this.initParticipantSearch(); //clear out results
    */
    participant = Page.map(participant);
    participant.startTime = '20:00';
    this.tempParticipant = participant;
  }

  public addManualVenue(){
    this.tempVenue = new Venue();
  }
  public addManualParticipant(){
    this.tempParticipant = new Page();
    this.tempParticipant.startTime = '20:00';
  }

  public manualVenueSubmit(){
    //remove errors
    this.venueResultError = false;
    let address = `${this.tempVenue.streetAddress || ''}`;
    this.geocodeAddress(address);
  }

  public manualParticipantSubmit(){
    //TODO: Do validations here
    this.participants.push(this.tempParticipant);
    this.tempParticipant = null;
    this.participantModalVisible = false;
  }

  public clearVenue(){
    this.venue = null;
  }

  public closeVenueModal(){
    this.tempVenue = null;
    this.initVenueSearch();
    this.venueSearch.nativeElement.value = '';
    this.venueModalVisible = false;
  }

  public closeParticipantModal(){
    this.tempParticipant = null;
    this.initParticipantSearch();//clear out search results
    this.participantSearch.nativeElement.value = '';
    this.participantModalVisible = false;
  }

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createEvent();
  }

  private getCategories(){
    this.categoryService.getCategories().then(categories => this.categories = categories.json().data)
      .catch(() => console.log('There was an error getting categories'));
  }

  public useManualResult(geocodeObj){
    let lat = geocodeObj.geometry.location.lat();
    let lng = geocodeObj.geometry.location.lng();
    let timestamp = this.event.startDate.utc().unix();
    console.log(this.event.startDate);
    this.tempVenue.lat = lat;
    this.tempVenue.lng = lng;
    this.eventService.getVenueTimezone(lat, lng, timestamp).then(result => {
      this.setTimezone(result.timeZoneId);
    }).catch(() => {

    });
    //save temp venue to real venue
    this.venue = this.tempVenue;
    //clear temp venue
    this.tempVenue = null;
    //clear results
    this.venueGeocodeResults = [];
    this.venueModalVisible = false;
  }

  private setTimezone(timezone){
    this.startDateTime.timezone = timezone;
  }

  private updateTimezone(){

  }

  public removeParticipant(participant){
    let index = this.participants.indexOf(participant);
    if(index !== -1){
      //element exists in our array
      this.participants.splice(index);
    }
  }

  private geocodeAddress(address) {
    this.geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        this._ngZone.run(() => this.venueGeocodeResults = results );
      } else {
        this._ngZone.run(() => this.venueResultError = true );
      }
    }.bind(this));
  }

  private createEvent(){
    let params = <any>{};
    let localStart = this.startDateTime.date;
    params.name = this.event.name;
    params.description = this.event.description;
    params.local_tz = this.startDateTime.date.tz();
    params.UTC_start = localStart.utc().format('YYYY-MM-DD HH-mm-ss');
    //params.UTC_end
    params.local_start = localStart.tz(params.local_tz).format('YYYY-MM-DD HH-mm-ss');
    //params.local_end
    if(this.venue){
      params.venue_name = this.venue.name;
      params.street_address = this.venue.streetAddress;
      params.city = this.venue.city;
      params.state = this.venue.state;
      params.postalcode = this.venue.postalCode;
      params.lat = this.venue.lat;
      params.lng = this.venue.lng;
    }
    if(this.venue && this.venue.id > 0){
      params.venue_id = this.venue.id;
    }
    this.eventService.createEvent(params).then(response => {
      console.log('it all worked out');
    }).catch(error => console.log(error));
    console.log('the form was submitted');
  }

  public showVenueModal(){
    this.venueModalVisible = true;
  }

  public showParticipantModal(){
    this.participantModalVisible = true;
  }

  public saveTimezone(){
    this.setTimezone(this.tempTimezone);
    this.timezoneModalVisible = false;
    this.tempTimezone = null;
  }
  
  public closeTimezoneModal(){
    this.timezoneModalVisible = false;
    this.tempTimezone = null;
  }
}
