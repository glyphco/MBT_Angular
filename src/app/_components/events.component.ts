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
  pageList: number[];

  constructor(private eventService:EventService){
    this.setPage(1);
  }

  public setPage(page:number){
    this.eventService.getEvents(page).then(events => {
      this.events = Event.arrayMap(events.json().data.data)
      let perPage = events.json().data.per_page;
      let totalEvents = events.json().data.total;

      this.currentPage = page;
      this.perPage = perPage;
      this.totalEvents = totalEvents;
      this.totalPages = Math.ceil(totalEvents / perPage);
      this.setPageList();
    }).catch(error => console.log(error));
  }

  private setPageList():void{
    if(this.currentPage <= 5){
      let end = this.totalPages < 10 ? this.totalPages : 10; 
      this.pageList = this.numberArrayFill(1, end);
    }else if(this.currentPage > 5){
      let start = this.currentPage - 4;
      let end = (this.currentPage + 5) < this.totalPages ? (this.currentPage + 5) : this.totalPages;
      this.pageList = this.numberArrayFill(start, end);
    }
  }

  private numberArrayFill(start, end):number[]{
    let list = []
    for (var i = start; i <= end; i++) {
      list.push(i);
    }
    return list;
  }
}
