import { Component } from '@angular/core';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  //styleUrls: ['./login.component.css']
})
export class EventsComponent {
  events: Event[];
  
  constructor(private eventService:EventService){
    eventService.getEvents().then(events => {
      this.events = Event.arrayMap(events.json().data.data);
      console.log(this.events);
    }).catch(error => console.log(error));
  }

}
