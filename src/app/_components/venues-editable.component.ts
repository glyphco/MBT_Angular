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
  orderBy = "name";
  publicPrivate;
  confirmedUnconfirmed;

  constructor(private venueService: VenueService, private meService:MeService){}

  ngOnInit():void{
    this.getVenuesEditable(1);
  }

  private getOptions(){
    let options = <any>{};
    options.sortby = this.orderBy;
    if(this.publicPrivate == "public"){
      options.public = 1;
    }else if(this.publicPrivate == "private"){
      options.private = 1;
    }

    if(this.confirmedUnconfirmed == "confirmed"){
      options.confirmed = 1
    }else if(this.confirmedUnconfirmed == "unconfirmed"){
      options.unconfirmed = 1;
    }
    return options;
  }

  getVenuesEditable(page:number):void {
    let options = this.getOptions();
    this.venueService.getVenuesEditable(page, 100, options).then(venues => {
      this.venues = venues.json().data.data;
      let perPage = venues.json().data.per_page;
      let totalObjects = venues.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }

  public confirmVenue(venue){
    this.venueService.confirmVenue(venue.id).then(response => {
      venue.confirmed = 1;
    }).catch(error => console.log(error));
  }

  public setOrderBy(value){
    this.orderBy = value;
    this.getVenuesEditable(1);
  }
  public setPublic(value){
    this.publicPrivate = value;
    this.getVenuesEditable(1);
  }
  public setConfirmed(value){
    this.confirmedUnconfirmed = value;
    this.getVenuesEditable(1);
  }
}
