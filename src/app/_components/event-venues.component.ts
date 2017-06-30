import { Component, OnInit } from '@angular/core';
import { EventVenueService } from '../_services/event-venue.service';
import { Pagination } from '../_helpers/pagination';

@Component({
  selector: 'app-event-venues',
  templateUrl: './event-venues.component.html',
  //styleUrls: ['./events.component.css']
})
export class EventVenuesComponent implements OnInit {
  pagination = new Pagination();
  events = [];

  constructor(private eventVenueService:EventVenueService){}

  ngOnInit():void{
    this.getEventVenues(1)
  }

  public getEventVenues(page:number){
    this.eventVenueService.getEventVenues(page).then(eventVenues => {
      this.events = eventVenues;
      let perPage = eventVenues.json().data.per_page;
      let totalObjects = eventVenues.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
}
