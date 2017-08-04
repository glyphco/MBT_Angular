import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventService } from '../_services/event.service';

declare var google:any;

@Component({
  selector: 'app-location-picker',
  styleUrls: ['location-picker.component.css'],
  template: `
    <div class="container white no-margin">
      <div id="location-picker-map"></div>
    </div>
  `
})
export class LocationPickerComponent implements OnInit, OnDestroy {
  eventId:any;
  map:any;
  private sub: any;

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ){}

  ngOnInit():void {
    let height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
    document.getElementById('location-picker-map').style.height = (height - 55) + 'px';
    //Google map stuff
    var origin = {lat: 41.94, lng: -87.68};
    this.map = new google.maps.Map(document.getElementById('location-picker-map'), {
      center: origin,
      zoom: 13
    });
  }

  ngOnDestroy():void {

  }

}
