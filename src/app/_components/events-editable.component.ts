import { Component, OnInit } from '@angular/core';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';
import { MeService } from '../_services/me.service';
import { Pagination } from '../_helpers/pagination';

@Component({
  selector: 'app-events',
  templateUrl: './events-editable.component.html',
  styleUrls: ['./events-editable.component.css']
})
export class EventsEditableComponent implements OnInit {
  pagination = new Pagination();
  events: Event[];

  constructor(private eventService:EventService, private meService:MeService){}

  ngOnInit():void{
    this.getEventsEditable(1)
  }

  public getEventsEditable(page:number){
    this.eventService.getEventsEditable(page).then(events => {
      this.events = Event.arrayMap(events.json().data.data)
      let perPage = events.json().data.per_page;
      let totalObjects = events.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
}
