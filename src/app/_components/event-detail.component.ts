import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  //styleUrls: ['./events.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: Event;
  private sub: any;

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  ngOnInit():void {
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getEvent(id);
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  private getEvent(id:number){
    this.eventService.getEvent(id).then(event => {
      this.event = Event.map(event.json().data);
    }).catch(error => console.log(error));
  }
}
