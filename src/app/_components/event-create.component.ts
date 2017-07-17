import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { StatesHelper } from '../_helpers/states-helper';
import { SearchService } from '../_services/search.service';
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
  private dateTime = new moment().tz('America/Los_Angeles');
  get date() {
    return this.dateTime;
  }
  get time() {
    return this.dateTime.format('HH:mm');
  }
  get timezone() {
    return this.dateTime.format('z');
    //return this.dateTime.tz.name;
  }
  set timezone(newTimezone:string) {
    this.dateTime.tz(newTimezone);
  }
}

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./modal.component.css','./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
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
  timezone = 'CST';
  timezoneId = 'America/Chicago';
  tempTimezone:string;

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location,
    private searchService: SearchService,
    private _ngZone: NgZone
  ){
    this.event.startTime = '20:00';
    this.event.startDate = moment();
  }

  ngOnInit():void {
    //Google map stuff
    this.geocoder = new google.maps.Geocoder;
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

  public useManualResult(geocodeObj){
    let lat = geocodeObj.geometry.location.lat();
    let lng = geocodeObj.geometry.location.lng();
    let timestamp = this.event.startDate.utc().unix();
    console.log(this.event.startDate);
    this.tempVenue.lat = lat;
    this.tempVenue.lng = lng;
    this.eventService.getVenueTimezone(lat, lng, timestamp).then(result => {
      let abbrevName = this.abbreviateTimezone(result.timeZoneName);
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

  private abbreviateTimezone(timezone):string{
    let timezones = {
      'Atlantic Daylight Time' :'ADT',
      'Alaska Daylight Time' :'AKDT',	
      'Alaska Standard Time' :'AKST',	
      'Atlantic Standard Time' :'AST',
      'Atlantic Time' :'AT',
      'Central Daylight Time' :'CDT',	
      'Central Standard Time' :'CST',	
      'Central Time' :'CT',
      'Eastern Daylight Time' :'EDT',
      'Eastern Greenland Summer Time' :'EGST',
      'East Greenland Time' :'EGT',
      'Eastern Standard Time' :'EST',	
      'Eastern Time' :'ET',
      'Greenwich Mean Time' :'GMT',
      'Hawaii-Aleutian Daylight Time' :'HADT',
      'Hawaii-Aleutian Standard Time' :'HAST',
      'Mountain Daylight Time' :'MDT',
      'Mountain Standard Time' :'MST',
      'Mountain Time' :'MT',
      'Newfoundland Daylight Time' :'NDT',
      'Newfoundland Standard Time' :'NST',
      'Pacific Daylight Time' :'PDT',
      'Pierre & Miquelon Daylight Time' :'PMDT',
      'Pierre & Miquelon Standard Time' :'PMST',
      'Pacific Standard Time' :'PST',
      'Pacific Time' :'PT',
      'Western Greenland Summer Time' :'WGST',
      'West Greenland Time' :'WGT'
      };
      return timezones[timezone];
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
    this.eventService.createEvent(this.event).then(response => {
      
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
    this.timezone = this.tempTimezone;
    this.timezoneModalVisible = false;
    this.tempTimezone = null;
  }
  
  public closeTimezoneModal(){
    this.timezoneModalVisible = false;
    this.tempTimezone = null;
  }
}

