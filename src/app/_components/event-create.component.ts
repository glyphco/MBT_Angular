import { Component } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';

const DATE_REGEX = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css','./modal.component.css']
})
export class EventCreateComponent {
  event = new Event;
  venueModalVisible = false;

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location
  ){
    this.event.startTime = '20:00';
  }

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

  startDateControl = new FormControl('', [
    Validators.pattern(DATE_REGEX)
  ]);
}
