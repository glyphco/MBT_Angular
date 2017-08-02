import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { StatesHelper } from '../_helpers/states-helper';
import { SearchService } from '../_services/search.service';
import { DateTime } from '../_helpers/date-time.service';
import { Event } from '../_models/event';
import { Venue } from '../_models/venue';
import { Page } from '../_models/page';
import { Show } from '../_models/show';
import { EventService } from '../_services/event.service';
import { MeService } from '../_services/me.service';
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
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./modal.component.css','./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  private apiEventId:number;
  uploadUrl:string;
  public uploader:FileUploader = new FileUploader({url: 'hello'});
  event = new Event();
  eventCategories = [];
  venue:Venue;
  shows = [];
  image:any;
  file_srcs = [];
  jpegImage:any;
  startDateTime = new DateTime();
  endDateTime = new DateTime();
  tempVenue:Venue; //used for creating a custom venue
  producers = [];
  tempProducer:Page;
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
    private route: ActivatedRoute,
    private location: Location,
    private searchService: SearchService,
    private _ngZone: NgZone,
    private router: Router,
    private meService: MeService
  ){
    this.event.startTime = '20:00';
    this.event.startDate = moment();
  }

  ngOnInit():void {
    //Google map stuff
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

  private showExists(show){
    for(let eventShow of this.shows){
      if(show.id == eventShow.id){
        return true;
      }
    }
    return false;
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
    if(this.participantSearch && this.participantSearch.nativeElement){
      this.participantSearch.nativeElement.value = '';
    }
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
    params.public = this.event.public;
    params.confirmed = this.event.confirmed;
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
    params.categories = this.eventCategories.length > 0 ? JSON.stringify(this.eventCategories) : undefined;
    let showsJson = [];
    for (let index in this.shows) {
      let tempShow = {};
      tempShow['id'] = this.shows[index].id;
      showsJson.push(tempShow);
    }
    params.shows = showsJson.length > 0 ? JSON.stringify(showsJson) : undefined;

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
    params.producers = producersJson.length > 0 ? JSON.stringify(producersJson) : undefined;
    console.log(params);
    this.saveEvent(params);
  }

  private saveEvent(params){
    this.eventService.createEvent(params).then(event => {
      return this.saveParticipants(event.id);
    }).then((eventId) => {
        return this.getS3Key(eventId);
    }).then((s3Credentials) => {
        if(s3Credentials){ //returns false if no image
          let url = s3Credentials.url;
          delete s3Credentials.url; //remove it from regular credentials
          return this.saveImage(s3Credentials, url);
        }
        return Promise.resolve(false);
    }).then((imageUrl) => {
      return imageUrl ? this.saveImageUrlToEvent(imageUrl): Promise.resolve(true);
    }).then((response) => {
      //TODO: handle event save
      this.router.navigate(['backstage']);
    }).catch(error => console.log(error));
  }

  private getS3Key(eventId){
    return new Promise((resolve, reject) => {
      if(this.jpegImage){
        this.eventService.getS3Key(eventId).then(response => {
          let timestamp = new Date().getTime();
          let s3Credentials = response.additionalData;
          s3Credentials.key = `event/${eventId}/main/${timestamp}.jpg`;
          s3Credentials.url = response.attributes.action;
          resolve(s3Credentials);
        }).catch(error => reject('S3 Credentials unavailable'));
      }else{
        resolve(false);
      }
    });
  }

  private saveImage(s3Credentials, url){
    return new Promise((resolve, reject) => {
      if(this.jpegImage){
        this.eventService.s3SaveImage(s3Credentials, url, this.jpegImage)
          .map(response => {
            //return the url to the file on s3
            if(response.status === 204){
              resolve(`${url}/${s3Credentials.key}`);
            }else{
              reject('S3 image save failed');
            }
          }).subscribe();
      }else{
        resolve(false);
      }
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
                this.jpegImage = resized_jpeg;
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
}
