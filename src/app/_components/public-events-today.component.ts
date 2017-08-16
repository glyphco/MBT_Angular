import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';
import { LocationService } from '../_services/location.service';
import { Pagination } from '../_helpers/pagination';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-public-events-today',
  templateUrl: './public-events-today.component.html',
  styleUrls: ['./events.component.css']
})
export class PublicEventsTodayComponent implements OnInit, OnDestroy {
  pagination = new Pagination();
  subscription: Subscription;
  events = [];
  location = this.locationService.getLocationName();
  loadingIndicatorVisible = false;

  constructor(private eventService:EventService, private locationService: LocationService){}

  ngOnInit():void{
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

  public getEvents(page:number){
    this.loadingIndicatorVisible = true;
    this.eventService.getPublicEventsToday(page).then(events => {
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
    this.eventService.getPublicEventsToday(page).then(events => {
      this.events = this.events.concat(Event.arrayMap(events.data));
      let perPage = events.per_page;
      let totalObjects = events.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }

}
