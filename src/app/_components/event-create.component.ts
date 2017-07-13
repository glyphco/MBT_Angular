import { Component, OnInit, NgZone } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { StatesHelper } from '../_helpers/states-helper';
import { SearchService } from '../_services/search.service';
import { Event } from '../_models/event';
import { Venue } from '../_models/venue';
import { EventService } from '../_services/event.service';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
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
  event = new Event();
  venue:Venue;
  tempVenue:Venue; //used for creating a custom venue
  states = StatesHelper.states;
  venueModalVisible = false;
  private searchTerms = new Subject<string>();
  venueResults: Observable<any[]>;
  geocoder:any;
  venueGeocodeResults = [];
  resultMapping:{[k: string]: string} = {'=0': '0 results.', '=1': '1 result.', 'other': '# results.'};
  venueResultError = false;

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location,
    private searchService: SearchService,
    private _ngZone: NgZone
  ){
    this.event.startTime = '20:00';
  }

  ngOnInit():void {
    //Google map stuff
    this.geocoder = new google.maps.Geocoder;
    //live search for venues
    this.venueResults = this.searchTerms
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

  searchVenues(term: string): void {
    this.searchTerms.next(term);
  }

  public chooseVenue(venue: any){
    this.venue = Venue.map(venue);
    this.venueModalVisible = false;
    this.venueResults = Observable.of<any[]>([]);
  }

  public addManualVenue(){
    //this.venueModalVisible = false;
    this.tempVenue = new Venue();
  }

  public manualVenueSubmit(){
    //remove errors
    this.venueResultError = false;
    let address = `${this.tempVenue.streetAddress || ''}, ${this.tempVenue.city || ''}, ${this.tempVenue.state || ''} ${this.tempVenue.postalCode || ''}`;
    console.log(address);
    //TODO: take out this debug code
    //let address = "19000 keeler ave, country club hills, IL 60478";
    this.geocodeAddress(address);
  }

  public clearVenue(){
    this.venue = null;
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
    this.tempVenue.lat = lat;
    this.tempVenue.lng = lng;
    //save temp venue to real venue
    this.venue = this.tempVenue;
    //clear temp venue
    this.tempVenue = null;
    //clear results
    this.venueGeocodeResults = [];
    this.venueModalVisible = false;
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
}
