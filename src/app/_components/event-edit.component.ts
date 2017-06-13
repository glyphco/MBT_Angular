import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  //styles: ['./page-edit.component.css']
})
export class EventEditComponent implements OnInit {
  event = new Event;
  private sub: any;
  categories = {};

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  ngOnInit():void{
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getEvent(id);
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  public getEvent(id:number){
    this.eventService.getEvent(id).then(event => {
      this.event = Event.map(event.json().data)
    }).catch(error => console.log(error));
  }

  public onSubmit(){
    console.log(this.event);
    /*
    this.eventService.updateEvent(this.event).then(response => {

    }).catch(error => console.log(error));
    console.log('the form was submitted');*/
  }
}
