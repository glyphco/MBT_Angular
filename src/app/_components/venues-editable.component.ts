import { Component, OnInit } from '@angular/core';
import { VenueService } from '../_services/venue.service';
import { Venue } from '../_models/venue';
import { Pagination } from '../_helpers/pagination';
import { MeService } from '../_services/me.service';

@Component({
  selector: 'app-venues',
  templateUrl: './venues-editable.component.html',
  styleUrls: ['./events-editable.component.css']
})
export class VenuesEditableComponent implements OnInit {
  
  pagination = new Pagination();
  venues: Venue[];

  constructor(private venueService: VenueService, private meService:MeService){}

  ngOnInit():void{
    this.getVenues(1);
  }

  getVenues(page:number):void {
    this.venueService.getVenues(page).then(venues => {
      this.venues = Venue.arrayMap(venues.json().data.data);
      let perPage = venues.json().data.per_page;
      let totalObjects = venues.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
}
