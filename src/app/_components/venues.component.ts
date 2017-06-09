import { Component, OnInit } from '@angular/core';
import { VenueService } from '../_services/venue.service';
import { Venue } from '../_models/venue';
import { Pagination } from '../_helpers/pagination';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./events.component.css']
})
export class VenuesComponent implements OnInit {
  
  pagination = new Pagination();
  venues: Venue[];

  constructor(private venueService: VenueService){}

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
