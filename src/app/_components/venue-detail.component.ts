import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Venue } from '../_models/venue';
import { VenueService } from '../_services/venue.service';
import { AnnouncementService } from '../_services/announcement.service';

@Component({
  selector: 'app-venue-detail',
  templateUrl: './venue-detail.component.html',
  styleUrls: ['./lists.component.css']
})
export class VenueDetailComponent implements OnInit, OnDestroy {
  venue: Venue;
  private sub: any;

  constructor(
    private venueService:VenueService,
    private route: ActivatedRoute,
    private location: Location,
    private announcementService: AnnouncementService
  ){}

  ngOnInit():void {
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getVenue(id);
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  private getVenue(id:number){
    this.venueService.getVenueDetails(id).then(venue => {
      this.venue = Venue.map(venue);
      console.log(this.venue);
    }).catch(error => console.log(error));
  }

  public likeItem(){
    let id = this.venue.id;
    let originalValue = this.venue.iLike;
    this.venue.iLike = +!originalValue; //toggle button
    this.venueService.likeShow(id).catch(error => {
      this.venue.iLike = originalValue;
      this.announcementService.openToasterApiError(error);
    });
  }
}
