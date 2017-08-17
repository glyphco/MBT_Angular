import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';
import { LocationService } from '../_services/location.service';
import { Pagination } from '../_helpers/pagination';
import { Subscription }   from 'rxjs/Subscription';

declare var google:any;

@Component({
  selector: 'app-events-current',
  templateUrl: './events-current.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsCurrentComponent implements OnInit, OnDestroy {
  pagination = new Pagination();
  subscription: Subscription;
  events = [];
  location = this.locationService.getLocationName();
  loadingIndicatorVisible = false;
  map:any;
  markers = [];
  circle:any;
  attendingDict:any;

  constructor(
    private eventService:EventService, 
    private locationService: LocationService,
    @Inject(DOCUMENT) private document: Document
  ){}

  ngOnInit():void{
    //Set up attending dictionary
    this.attendingDict = this.eventService.attendingDict;

    //Get events
    this.getEvents(1);
    this.subscription = this.locationService.locationChange$.subscribe(change => {
        //refresh list when location changes
        this.getEvents(1);
    });
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }


  public trackEvent(index, event){
    return event.id;
  }

  public nextAttendingOption(event:Event){
    this.eventService.toggleNextAttendingStatus(event);
  }

  public getEvents(page:number){
    this.loadingIndicatorVisible = true;
    this.eventService.getEventsCurrent(page).then(events => {
      this.events = Event.arrayMap(events.data);
      let perPage = events.per_page;
      let totalObjects = events.total;
      this.pagination.setPage(page, perPage, totalObjects);
      this.loadingIndicatorVisible = false;
      console.log(this.events);

      //Populate Google map
      //this.populateMap();
    }).catch(error => {
      this.loadingIndicatorVisible = false;
      console.log(error);
    });
  }

  public loadNextPage(){
    let page = this.pagination.currentPage + 1;
    this.eventService.getEventsCurrent(page).then(events => {
      this.events = this.events.concat(Event.arrayMap(events.data));
      let perPage = events.per_page;
      let totalObjects = events.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
}