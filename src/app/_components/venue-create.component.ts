import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Venue } from '../_models/venue';
import { VenueService } from '../_services/venue.service';

declare var google:any;

@Component({
  selector: 'app-venue-create',
  templateUrl: './venue-create.component.html',
  styleUrls: ['./venue-create.component.css']
})
export class VenueCreateComponent implements OnInit {
  venue = new Venue;

  constructor(
    private venueService:VenueService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  ngOnInit():void{
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {

        var waypts = [];
        var checkboxArray:any[] = [
            'winnipeg', 'regina','calgary'
    ];
    for (var i = 0; i < checkboxArray.length; i++) {

          waypts.push({
            location: checkboxArray[i],
            stopover: true
          });

      }

      directionsService.route({
        origin: {lat: 41.85, lng: -87.65},
        destination: {lat: 49.3, lng: -123.12},
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
  }

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
