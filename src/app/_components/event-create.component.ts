import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./modal.component.css']
})
export class EventCreateComponent {
  event = new Event;
  venueModalVisible = false;

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createEvent();
  }

  private createEvent(){
    this.eventService.createEvent(this.event).then(response => {
      
    }).catch(error => console.log(error));
    console.log('the form was submitted');
  }

  public showVenueModal(){
    this.venueModalVisible = true;
  }
}
