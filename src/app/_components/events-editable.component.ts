import { Component, OnInit } from '@angular/core';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';
import { MeService } from '../_services/me.service';
import { Pagination } from '../_helpers/pagination';

@Component({
  selector: 'app-events',
  templateUrl: './events-editable.component.html',
  styleUrls: ['./backstage.component.css']
})
export class EventsEditableComponent implements OnInit {
  pagination = new Pagination();
  confirmedUnconfirmed;
  events: Event[];
  orderBy = "date";
  publicPrivate;

  constructor(private eventService:EventService, private meService:MeService){}

  ngOnInit():void{
    this.getEventsEditable(1)
  }

  private getOptions(){
    let options = <any>{};
    options.sortby = this.orderBy;
    if(this.publicPrivate == "public"){
      options.public = 1;
    }else if(this.publicPrivate == "private"){
      options.private = 1;
    }

    if(this.confirmedUnconfirmed == "confirmed"){
      options.confirmed = 1
    }else if(this.confirmedUnconfirmed == "unconfirmed"){
      options.unconfirmed = 1;
    }
    return options;
  }

  public getEventsEditable(page:number){
    if(page < 0){
      return false;
    }
    let options = this.getOptions();
    this.eventService.getEventsEditable(page, 100, options).then(events => {
      this.events = Event.arrayMap(events.data);
      let perPage = events.per_page;
      let totalObjects = events.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }

  public confirmEvent(event){
    this.eventService.confirmEvent(event.id).then(response => {
      event.confirmed = 1;
    }).catch(error => console.log(error));
  }

  public setOrderBy(value){
    this.orderBy = value;
    this.getEventsEditable(1);
  }
  public setPublic(value){
    this.publicPrivate = value;
    this.getEventsEditable(1);
  }
  public setConfirmed(value){
    this.confirmedUnconfirmed = value;
    this.getEventsEditable(1);
  }
}
