import { Component, OnInit } from '@angular/core';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';
import { Pagination } from '../_helpers/pagination';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  pagination = new Pagination();
  events: Event[];

  constructor(private eventService:EventService){}

  ngOnInit():void{
    this.getEvents(1)
  }

  public getEvents(page:number){
    this.eventService.getEvents(page).then(events => {
      this.events = Event.arrayMap(events.json().data.data)
      let perPage = events.json().data.per_page;
      let totalObjects = events.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
}
