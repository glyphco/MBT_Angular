import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Venue } from '../_models/venue';
import { VenueService } from '../_services/venue.service';

@Component({
  selector: 'app-venue-create',
  templateUrl: './venue-create.component.html',
  //styles: ['./page-edit.component.css']
})
export class VenueCreateComponent {
  venue = new Venue;

  constructor(
    private venueService:VenueService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createVenue();
  }

  private createVenue(){
    this.venueService.createVenue(this.venue).then(response => {
      
    }).catch(error => console.log(error));
  }
}
