import { Component } from '@angular/core';
import { VenueService } from '../_services/venue.service';
import { Venue } from '../_models/venue';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  //styleUrls: ['./login.component.css']
})
export class DashboardComponent {

  constructor(private venueService: VenueService){
    venueService.getVenues().then(venues => {
      //console.log(venues.json().data as [Venue]);
      console.log(venues);
    }).catch(error => console.log(error));
  }
}
