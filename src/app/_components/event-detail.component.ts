import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./lists.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: Event;
  private sub: any;

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
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

  goEdit():void {
    this.router.navigate(['/event/edit', this.event.id])
  }

  private getEvent(id:number){
    this.eventService.getEventDetails(id).then(event => {
      this.event = Event.map(event);
      console.log(this.event);
    }).catch(error => console.log(error));
  }
}
