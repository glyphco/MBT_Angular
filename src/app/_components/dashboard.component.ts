import { Component, NgZone } from '@angular/core';
import { VenueService } from '../_services/venue.service';
import { Venue } from '../_models/venue';
import { EventsComponent } from './events.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  //styleUrls: ['./login.component.css']
})
export class DashboardComponent {

  venues: Venue[];

  constructor(private venueService: VenueService, private _ngZone:NgZone){
    venueService.getVenues().then(venues => {
      //this.venues = venues.json().data as [Venue];
      this.venues = Venue.arrayMap(venues.json().data);
      console.log(this.venues);
    }).catch(error => console.log(error));
  }
}
