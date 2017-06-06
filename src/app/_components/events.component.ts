import { Component } from '@angular/core';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events: Event[];
  totalEvents = 0;
  currentPage = 1;
  perPage = 0;
  totalPages = 0;

  constructor(private eventService:EventService){
    eventService.getEvents().then(events => {
      this.events = Event.arrayMap(events.json().data.data);
      let perPage = events.json().data.per_page;
      let totalEvents = events.json().data.total;

      this.perPage = perPage;
      this.totalEvents = totalEvents;
      this.totalPages = Math.ceil(totalEvents / perPage);
    }).catch(error => console.log(error));
  }

}
