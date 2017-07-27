import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventVenueService } from '../_services/event-venue.service';
import { LocationService } from '../_services/location.service';
import { Pagination } from '../_helpers/pagination';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-public-events',
  templateUrl: './public-events.component.html',
  styleUrls: ['./public-events.component.css']
})
export class PublicEventsComponent implements OnInit, OnDestroy {
  pagination = new Pagination();
  subscription: Subscription;
  events = [];
  location = this.locationService.getLocationName();
  loadingIndicatorVisible = false;

  constructor(private eventVenueService:EventVenueService, private locationService: LocationService){}

  ngOnInit():void{
    this.getEventVenues(1);
    this.subscription = this.locationService.locationChange$.subscribe(change => {
        //refresh list when location changes
        this.getEventVenues(1);
    });
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }

  public trackEvent(index, event){
    return event.id;
  }

  public getEventVenues(page:number){
    this.loadingIndicatorVisible = true;
    this.eventVenueService.getEventVenues(page).then(eventVenues => {
      this.events = eventVenues.json().data.data;
      let perPage = eventVenues.json().data.per_page;
      let totalObjects = eventVenues.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
      this.loadingIndicatorVisible = false;
    }).catch(error => {
      this.loadingIndicatorVisible = false;
      console.log(error);
    });
  }

  public loadNextPage(){
    let page = this.pagination.currentPage + 1;
    this.eventVenueService.getEventVenues(page).then(eventVenues => {
      this.events = this.events.concat(eventVenues.json().data.data);
      let perPage = eventVenues.json().data.per_page;
      let totalObjects = eventVenues.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
      console.log(this.events);
    }).catch(error => console.log(error));
  }
}
