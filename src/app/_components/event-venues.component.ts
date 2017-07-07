import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventVenueService } from '../_services/event-venue.service';
import { LocationService } from '../_services/location.service';
import { Pagination } from '../_helpers/pagination';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-event-venues',
  templateUrl: './event-venues.component.html',
  styleUrls: ['./events.component.css']
})
export class EventVenuesComponent implements OnInit, OnDestroy {
  pagination = new Pagination();
  subscription: Subscription;
  events = [];
  location:string;

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

  public getEventVenues(page:number){
    this.eventVenueService.getEventVenues(page).then(eventVenues => {
      this.events = eventVenues.json().data.data;
      let perPage = eventVenues.json().data.per_page;
      let totalObjects = eventVenues.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
}
