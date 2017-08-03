import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-event-delete',
  template: `
    <div class="container white">
      <h3>You are about to delete an event.</h3>
      <h4>Are you sure you want to do this?</h4>
      <button class="btn btn-danger" (click)="deleteEvent()">Confirm delete</button>
      <button class="btn btn-primary" (click)="goBack()">Back</button>
    </div>
  `
})
export class EventDeleteComponent implements OnInit, OnDestroy {
  eventId:any;
  private sub: any;

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ){}

  ngOnInit():void {
    //get the current event
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.eventId = id;
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  deleteEvent(){
    //put the delete code here
    console.log(this.eventId);
    this.eventService.deleteEvent(this.eventId).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
  }

  public goBack(): void {
    this.location.back();
  }
}
