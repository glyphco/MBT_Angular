import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { VenueService } from '../_services/venue.service';

@Component({
  selector: 'app-venue-delete',
  template: `
    <div class="container white">
      <h3>You are about to delete a venue.</h3>
      <h4>Are you sure you want to do this?</h4>
      <button class="btn btn-danger" (click)="deleteVenue()">Confirm delete</button>
      <button class="btn btn-primary" (click)="goBack()">Back</button>
    </div>
  `
})
export class VenueDeleteComponent implements OnInit, OnDestroy {
  venueId:any;
  private sub: any;

  constructor(
    private venueService:VenueService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ){}

  ngOnInit():void {
    //get the current page
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.venueId = id;
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  deleteVenue(){
    //put the delete code here
    this.venueService.deleteVenue(this.venueId).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
  }

  public goBack(): void {
    this.location.back();
  }
}
