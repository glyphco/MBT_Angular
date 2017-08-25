import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Event } from '../_models/event';
import { MeService } from '../_services/me.service';
import { EventService } from '../_services/event.service';
import {FormControl, Validators} from '@angular/forms';
import { StatesHelper } from '../_helpers/states-helper';
import { SearchService } from '../_services/search.service';
import { LocationService } from '../_services/location.service';
import { ImageUploadService } from '../_services/image-upload.service';
import { DateTime } from '../_helpers/date-time.service';
import { Venue } from '../_models/venue';
import { Page } from '../_models/page';
import { Show } from '../_models/show';
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

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./modal.component.css','./event-create.component.css']
})
export class EventEditComponent implements OnInit {
  private apiEventId:number;
  private sub:any;
  uploadUrl:string;
  eventCategories = []; //for filling the dropdown
  event = new Event();
  venue:Venue;
  shows = [];
  image:any;
  producers = [];
  tempProducer:Page;
  startDateTime = new DateTime();
  endDateTime = new DateTime();
  tempVenue:Venue; //used for creating a custom venue
  participants = [];
  tempParticipant:Page;
  states = StatesHelper.states;
  venueModalVisible = false;
  timezoneModalVisible = false;
  producerModalVisible = false;
  participantModalVisible = false;
  showModalVisible = false;
  hasEndDate = false;
  private searchVenueTerms = new Subject<string>();
  private searchProducerTerms = new Subject<string>();
  private searchParticipantTerms = new Subject<string>();
  private searchShowTerms = new Subject<string>();
  venueResults: Observable<any[]>;
  producerResults: Observable<any[]>;
  participantResults: Observable<any[]>;
  showResults: Observable<any[]>;
  geocoder:any;
  venueGeocodeResults = [];
  resultMapping:{[k: string]: string} = {'=0': '0 results.', '=1': '1 result.', 'other': '# results.'};
  venueResultError = false;
  @ViewChild('producerSearch') producerSearch: ElementRef;
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
    private meService:MeService,
    private route: ActivatedRoute,
    private location: Location,
    private searchService: SearchService,
    private _ngZone: NgZone,
    private router: Router,
    private locationService: LocationService,
    private imageUploadService: ImageUploadService
  ){}

  ngOnInit():void {
    //get the current event
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getEventEdit(id);
    });

    //Init google map geocoder
    this.geocoder = new google.maps.Geocoder;
    //live search for venues
    this.initVenueSearch();
    //live search for producers
    this.initProducerSearch();
    //live search for participants
    this.initParticipantSearch();
    //live search for shows
    this.initShowSearch();
  }

  private getEventEdit(id):void{
    this.eventService.getEventEdit(id).then(event => {
      this.event = Event.map(event);
      this.event.startTime = '20:00';
      this.event.startDate = moment();
      console.log(this.event);
      this.startDateTime = new DateTime(this.event.localStart, this.event.localTz);
      if(this.event.localEnd){
        this.hasEndDate = true;
        this.endDateTime = new DateTime(this.event.localEnd, this.event.localTz);
      }
      if(this.event.venueName){
        this.venue = new Venue();
        this.venue.name = this.event.venueName;
        this.venue.id = this.event.venueId;
      }
      for(let participant of this.event.participants){
        let tempParticipant = new Page();
        tempParticipant.id = participant.page_id;
        tempParticipant.name = participant.name;
        tempParticipant.startTime = participant.start;
        tempParticipant.imageUrl = participant.imageurl;
        this.participants.push(tempParticipant);
      }
      this.eventCategories = this.event.categoriesJson ? JSON.parse(this.event.categoriesJson) : [];
    }).catch(error => console.log(error));
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

  private initProducerSearch(){
    this.producerResults = this.searchProducerTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.searchService.searchProducers(term)
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

  private initShowSearch(){
    this.showResults = this.searchShowTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.searchService.searchShows(term)
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

  searchProducers(term: string): void {
    this.searchProducerTerms.next(term);
  }

  searchParticipants(term: string): void {
    this.searchParticipantTerms.next(term);
  }

  searchShows(term: string): void {
    this.searchShowTerms.next(term);
  }

  public chooseVenue(venue: any){
    let venueObj = Venue.map(venue);
    this.venue = venueObj;
    this.setTimezone(venueObj.localTz);
    this.venueModalVisible = false;
    this.initVenueSearch(); //clear out results
  }

  public chooseProducer(producer: any){
    this.producers.push(Page.map(producer));
    this.producerModalVisible = false;
    this.initProducerSearch(); //clear out results
  }

  public chooseParticipant(participant: any){
    participant = Page.map(participant);
    participant.startTime = '20:00';
    this.tempParticipant = participant;
  }

  public chooseShow(show: any){
    this.shows.push(Show.map(show));
    this.showModalVisible = false;
    this.initShowSearch(); //clear out results
  }

  public addManualVenue(){
    this.tempVenue = new Venue();
  }

  public addManualProducer(){
    this.tempProducer = new Page();
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

  public manualProducerSubmit(){
    //TODO: Do validations here
    this.producers.push(this.tempProducer);
    this.tempProducer = null;
    this.producerModalVisible = false;
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

  public closeProducerModal(){
    this.producerModalVisible = false;
    this.tempProducer = null;
    if(this.producerSearch && this.producerSearch.nativeElement){
      this.producerSearch.nativeElement.value = '';
    }
    this.initProducerSearch();//clear out search results
  }

  public closeParticipantModal(){
    this.tempParticipant = null;
    this.initParticipantSearch();//clear out search results
    this.participantSearch.nativeElement.value = '';
    this.participantModalVisible = false;
  }

  public closeShowModal(){
    this.showModalVisible = false;
  }

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createEvent();
  }

  public useManualResult(geocodeObj){
    let locationDetails = <any>{};
    for (let component of geocodeObj.address_components){
      locationDetails[component.types[0]] = component.long_name;
    }
    let aptNum = locationDetails.subpremise ? locationDetails.subpremise : '';
    let lat = geocodeObj.geometry.location.lat;
    let lng = geocodeObj.geometry.location.lng;
    let timestamp = this.event.startDate.utc().unix();
    this.tempVenue.lat = lat;
    this.tempVenue.lng = lng;
    this.tempVenue.streetAddress = `${locationDetails.street_number} ${locationDetails.route} ${aptNum}`;
    this.tempVenue.city = locationDetails.locality;
    this.tempVenue.state = locationDetails.administrative_area_level_1;
    this.tempVenue.postalCode = locationDetails.postal_code;
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
    this.endDateTime.timezone = timezone;
  }

  public removeProducer(producer){
    let index = this.producers.indexOf(producer);
    if(index !== -1){
      //element exists in our array
      this.producers.splice(index, 1);
    }
  }

  public removeParticipant(participant){
    let index = this.participants.indexOf(participant);
    if(index !== -1){
      //element exists in our array
      this.participants.splice(index, 1);
    }
  }

  public removeShow(show){
    let index = this.shows.indexOf(show);
    if(index !== -1){
      //element exists in our array
      this.shows.splice(index, 1);
    }
  }

  private geocodeAddress(address) {
    this.locationService.getGeocodeAddress(address).then(response => {
      this.venueGeocodeResults = response.results;
      if(response.results.length == 0){
        this.venueResultError = true;
      }
    }).catch(error => {
      this.venueResultError = true;
    });
  }

  private createEvent(){
    let params = <any>{};
    let localStart = this.startDateTime.date;
    let localEnd = this.endDateTime.date;
    params.id = this.event.id;
    params.name = this.event.name;
    params.description = this.event.description;
    params.local_tz = this.startDateTime.date.tz();
    params.UTC_start = localStart.utc().format('YYYY-MM-DD HH-mm-ss');
    params.local_start = localStart.tz(params.local_tz).format('YYYY-MM-DD HH-mm-ss');
    params.public = this.event.public;
    params.confirmed = this.event.confirmed;
    if(this.hasEndDate){
      params.UTC_end = localEnd.utc().format('YYYY-MM-DD HH-mm-ss');
      params.local_end = localEnd.tz(params.local_tz).format('YYYY-MM-DD HH-mm-ss');
    }
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
    //save categories
    params.categories = JSON.stringify(this.eventCategories);
    //save shows
    let showsJson = [];
    for (let index in this.shows) {
      let tempShow = {};
      tempShow['id'] = this.shows[index].id;
      showsJson.push(tempShow);
    }
    params.shows = JSON.stringify(showsJson);
    //save participants
    let participantsJson = [];
    for (let participant of this.participants){
      let tempParticipant = {
        page_id: participant.id > 0 ? participant.id : undefined,
        name: participant.name,
        info: participant.tagline,
        imageurl: participant.imageUrl,
        start: participant.startTime,
        public: 1,
        confirmed: 1
        //private_info: TODO: make this a thing 
      }
      participantsJson.push(tempParticipant);
    }
    params.participants = participantsJson.length > 0 ? JSON.stringify(participantsJson) : undefined;
    //save producers
    let producersJson = [];
    for (let producer of this.producers){
      let tempProducer = {
        page_id: producer.id > 0 ? producer.id : undefined,
        name: producer.name,
        info: producer.tagline,
        imageurl: producer.imageUrl
        //private_info: TODO: make this a thing 
      }
      producersJson.push(tempProducer);
    }
    params.producers = JSON.stringify(producersJson);

    this.updateEvent(params);
  }

  private updateEvent(params){
    this.uploadImageIfExist().then((imageUrl:string) => {
      if(imageUrl){
        params.imageurl = imageUrl;
      }
      return this.eventService.updateEvent(params);
    }).then((event) => {
      //TODO: handle event save
      this.router.navigate(['/events/editable']);
    }).catch(error => console.log(error));
  }

  private uploadImageIfExist():Promise<any>{
      if(this.image){
        return this.imageUploadService.uploadImageToS3(this.image, 'event', this.event.id, 'main');
      }
      return Promise.resolve(false);
  }

  private saveShows(eventId):Promise<number>{
    return new Promise((resolve, reject) => {
      let savedShows = 0;
      let numShows = this.shows.length;
      for (let index in this.shows) {
        this.eventService.addShow(eventId, this.shows[index]).then(response => {
          savedShows++
          if(savedShows == numShows){
            //all shows have been saved
            resolve(eventId);
          }
        }).catch(error => reject('There was an error adding the participant'));
      }
      resolve(eventId);
    });
  }

  public showVenueModal(){
    this.venueModalVisible = true;
  }

  public showProducerModal(){
    this.producerModalVisible = true;
  }

  public showParticipantModal(){
    this.participantModalVisible = true;
  }

  public showShowModal(){
    this.showModalVisible = true;
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

  fileChange(imageField){
    //store file temporarily
    this.image = imageField.files[0];
  }
}
