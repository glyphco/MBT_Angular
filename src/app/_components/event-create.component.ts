import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { StatesHelper } from '../_helpers/states-helper';
import { SearchService } from '../_services/search.service';
import { CategoryService } from '../_services/category.service';
import { Event } from '../_models/event';
import { Venue } from '../_models/venue';
import { Page } from '../_models/page';
import { Show } from '../_models/show';
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
  get rawDate(){
    return this._dateTime.toDate();
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
  private apiEventId:number;
  uploadUrl:string;
  public uploader:FileUploader = new FileUploader({url: 'hello'});
  categories = []; //for filling the dropdown
  event = new Event();
  eventCategory:string;
  venue:Venue;
  shows = [];
  image:any;
  file_srcs = [];
  jpegImage:any;
  startDateTime = new DateTime();
  endDateTime = new DateTime();
  tempVenue:Venue; //used for creating a custom venue
  participants = [];
  tempParticipant:Page;
  states = StatesHelper.states;
  venueModalVisible = false;
  timezoneModalVisible = false;
  participantModalVisible = false;
  showModalVisible = false;
  hasEndDate = false;
  private searchVenueTerms = new Subject<string>();
  private searchParticipantTerms = new Subject<string>();
  private searchShowTerms = new Subject<string>();
  venueResults: Observable<any[]>;
  participantResults: Observable<any[]>;
  showResults: Observable<any[]>;
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
    //live search for shows
    this.initShowSearch();
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

  public closeShowModal(){
    this.showModalVisible = false;
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
    let locationDetails = <any>{};
    for (let component of geocodeObj.address_components){
      locationDetails[component.types[0]] = component.long_name;
    }
    let aptNum = locationDetails.subpremise ? locationDetails.subpremise : '';
    let lat = geocodeObj.geometry.location.lat();
    let lng = geocodeObj.geometry.location.lng();
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

  public removeParticipant(participant){
    let index = this.participants.indexOf(participant);
    if(index !== -1){
      //element exists in our array
      this.participants.splice(index);
    }
  }

  public removeShow(show){
    let index = this.shows.indexOf(show);
    if(index !== -1){
      //element exists in our array
      this.shows.splice(index);
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
    let localEnd = this.endDateTime.date;
    params.name = this.event.name;
    params.description = this.event.description;
    params.local_tz = this.startDateTime.date.tz();
    params.UTC_start = localStart.utc().format('YYYY-MM-DD HH-mm-ss');
    params.local_start = localStart.tz(params.local_tz).format('YYYY-MM-DD HH-mm-ss');
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

    this.saveEvent(params);
  }

  private saveEvent(params){
    this.eventService.createEvent(params).then(event => {
      return this.saveParticipants(event.id);
    }).then((eventId) => {
      this.apiEventId = eventId;
      return this.saveCategory(eventId);
    }).then((eventId) => {
      return this.saveShows(eventId);
    }).then((eventId) => {
      return this.getS3Key(eventId);
    }).then((s3Credentials) => {
      let url = s3Credentials.url;
      delete s3Credentials.url; //remove it from regular credentials
      return this.saveImage(s3Credentials, url);
    }).then((imageUrl) => {
      return this.saveImageUrlToEvent(imageUrl);
    }).then((response) => {
      //TODO: handle event save
      console.log('Event saved');
    }).catch(error => console.log(error));
  }

  private getS3Key(eventId){
    return new Promise((resolve, reject) => {
      this.eventService.getS3Key(eventId).then(response => {
        let timestamp = new Date().getTime();
        let s3Credentials = response.additionalData;
        console.log(s3Credentials);
        s3Credentials.key = `event/${eventId}/main/${timestamp}.jpg`;
        s3Credentials.url = response.attributes.action;
        resolve(s3Credentials);
      }).catch(error => reject('S3 Credentials unavailable'));
    });
  }

  private saveImage(s3Credentials, url){
    return new Promise((resolve, reject) => {
      this.eventService.s3SaveImage(s3Credentials, url, this.jpegImage).then(response => {
        //return the url to the file on s3
        resolve(`${s3Credentials.attributes.action}/${s3Credentials.additionalData.key}`);
      }).catch(error => reject('S3 save failed'));
    });
  }

  private saveImageUrlToEvent(imageUrl){
    return new Promise((resolve, reject) => {
      this.eventService.saveImageUrl(this.apiEventId, imageUrl).then(response => {
        //return the url to the file on s3
        resolve(true);
      }).catch(error => reject('Attaching image to event failed.'));
    });
  }

  private saveParticipants(eventId):Promise<number>{
    return new Promise((resolve, reject) => {
      let savedParticipants = 0;
      let numParticipants = this.participants.length;
      for (let index in this.participants) {
        this.eventService.addParticipant(eventId, this.participants[index]).then(response => {
          savedParticipants++
          if(savedParticipants == numParticipants){
            //all participants have been saved
            resolve(eventId);
          }
        }).catch(error => reject('There was an error adding the participant'));
      }
      resolve(eventId);
    });
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

  private saveCategory(eventId):Promise<number>{
    return new Promise((resolve, reject) => {
      if(this.eventCategory){
        //parse category data
        let parentCategory = this.eventCategory.split(',')[0];
        let subCategory = this.eventCategory.split(',')[1];
        this.eventService.addCategory(eventId,parentCategory,subCategory).then(response => {
          resolve(eventId);
        }).catch(error => reject('There was an error saving category.'));
      }else{
        resolve(eventId);
      }
    });
  }

  public showVenueModal(){
    this.venueModalVisible = true;
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
    this.readFiles(imageField.files);
  }

  readFiles(files, index = 0) {  
      // Create the file reader  
      let reader = new FileReader();  
      // If there is a file  
      if (index in files) {  
        // Start reading this file  
        this.readFile(files[index], reader, (result) => {  
            // Create an img element and add the image file data to it  
            var img = document.createElement("img");  
            img.src = result;  
            // Send this img to the resize function (and wait for callback)  
            this.resize(img, 200, 200, (resized_jpeg, before, after) => {  
                // For debugging (size in bytes before and after)  
                //this.debug_size_before.push(before);  
                //this.debug_size_after.push(after);  
                // Add the resized jpeg img source to a list for preview  
                // This is also the file you want to upload. (either as a  
                // base64 string or img.src = resized_jpeg if you prefer a file).  
                this.file_srcs.push(resized_jpeg);
                this.jpegImage = resized_jpeg;
                console.log(before);
                console.log(after);
                // Read the next file;  
                this.readFiles(files, index + 1);  
            });  
        });  
      } else {  
        // When all files are done This forces a change detection  
        //this.changeDetectorRef.detectChanges();  
      }  
  }

  private readFile(file, reader, callback) {  
    reader.onload = () => {  
        callback(reader.result);  
        this.image = reader.result;   
    }  
    reader.readAsDataURL(file);  
  }

  private resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {  
    // This will wait until the img is loaded before calling this function  
    return img.onload = () => {  
        // Get the images current width and height  
        var width = img.width;  
        var height = img.height;  
        // Set the WxH to fit the Max values (but maintain proportions)
        if (width > height) {  
            if (width > MAX_WIDTH) {  
                height *= MAX_WIDTH / width;  
                width = MAX_WIDTH;  
            }  
        } else {  
            if (height > MAX_HEIGHT) {  
                width *= MAX_HEIGHT / height;  
                height = MAX_HEIGHT;  
            }  
        }
        // create a canvas object  
        var canvas = document.createElement("canvas");  
        // Set the canvas to the new calculated dimensions  
        canvas.width = width;  
        canvas.height = height;  
        var ctx = canvas.getContext("2d");  
        ctx.drawImage(img, 0, 0, width, height);  
        // Get this encoded as a jpeg  
        // IMPORTANT: 'jpeg' NOT 'jpg'  
        var dataUrl = canvas.toDataURL('image/jpeg');  
        // callback with the results  
        callback(dataUrl, img.src.length, dataUrl.length);  
    }; 
  }

  public debugImage(){
    console.log(this.image);
  }
}
