import { Component, OnInit, OnDestroy, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventService } from '../_services/event.service';
import { LocationService } from '../_services/location.service';
import { DateTime } from '../_helpers/date-time.service';
import { environment } from '../../environments/environment';
import * as moment from 'moment-timezone'; // add this 1 of 4

declare var google:any;

@Component({
  selector: 'app-location-picker',
  styleUrls: ['location-picker.component.css'],
  template: `
    <div class="container white no-margin">
      <div class="map-options-container clearfix">
        <button class="map-button-square map-focus pull-left" (click)="focusLocation()"><i class="fa fa-crosshairs" aria-hidden="true"></i></button>

        <label>Distance: </label>
        <select class="map-button-select" [(ngModel)]="dist" (change)="distanceChanged()">
          <option value="0.5">0.5 miles</option>
          <option value="1">1 mile</option>
          <option value="2">2 miles</option>
          <option value="5">5 miles</option>
          <option value="10">10 miles</option>
          <option value="20">20 miles</option>
        </select>

        <button class="map-button-square map-close pull-right" (click)="closeMap()"><i class="fa fa-times" aria-hidden="true"></i></button>
      </div>

      

      <div id="location-picker-map"></div>
      <div class="map-buttons-container clear-fix">
        <button class="map-button map-save" (click)=saveLocation()>Save</button>
        <button class="map-button map-cancel" (click)="closeMap()">Cancel</button>
      </div>
    </div>
  `
})
export class LocationPickerComponent implements OnInit, OnDestroy {
  eventId:any;
  map:any;
  lat = 41.94;
  lng = -87.68;
  originLat:number;
  originLng:number;
  chosenLat:number;
  chosenLng:number;
  dist = 0.5;
  geocoder:any;
  marker:any;
  circle:any;
  markers = [];
  private sub: any;
  private locationInfo: any; //used for location save
  @Input() visible;
  @Output() visibleChange = new EventEmitter();

  constructor(
    private eventService:EventService,
    private _ngZone:NgZone, 
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private locationService: LocationService
  ){}

  ngOnInit():void {
    //Google map stuff
    this.map = new google.maps.Map(document.getElementById('location-picker-map'));
    this.circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map
    });

    //init map location
    this.setMapStartingLocation();

    let windowHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
    let navbarHeight = 55;
    let saveCancelHeight = 40;
    let optionsHeight = 40;
    document.getElementById('location-picker-map').style.height = (windowHeight - navbarHeight - saveCancelHeight - optionsHeight) + 'px';

    //Google map stuff
    this.geocoder = new google.maps.Geocoder;
this.populateMap();
    this.circle.addListener("click", function (event) {
      this.clickReceived(event);
    }.bind(this));

    this.map.addListener("click", function (event) {
      this.clickReceived(event);
    }.bind(this));
  }

  ngOnDestroy():void {

  }

  closeMap(){
    this.visibleChange.emit(false);
  }

  saveLocation(){
    if((this.lat && this.lng && this.dist) 
      && (this.lat != this.locationService.getLat() 
        || this.lng != this.locationService.getLng() 
        || this.dist != this.locationService.getDist())
      ){
      //new location is different from old location
      this.geocodeLatLng().then(locationInfo => {
        //set user location text
        //this.userLocation = this.locationService.getLocationName();
        this.locationInfo = locationInfo;
        let timestamp = moment().utc().unix();
        return this.locationService.getApiTimezone(this.lat, this.lng, timestamp);
      }).then(response => {
        this.locationInfo.timezone = response.timeZoneId;
        this.locationService.setCurrentLocation(this.locationInfo);
        //emit location change event
        this.locationService.locationSource.next(true);
        this.closeMap();
      }).catch(error => console.log(error));
    }else{
      
    }
  }

  focusLocation(){
    this.getOrigin();
  }

  private setMapStartingLocation(){
    if(this.locationService.hasCurrentLocation()){ 
      //put local location on the map
      this.lat = this.chosenLat = this.locationService.getLat();
      this.lng = this.chosenLng = this.locationService.getLng();
      this.dist = this.locationService.getDist();
      this.setMapZoom();
      this.map.setCenter({lat: this.lat, lng: this.lng});
      this.placeMarkerAndCircle();
    }else{ //Ask for location if we don't have it in local storage
      this.getOrigin();
    }
  }

  private getOrigin(){
    this.locationService.getOrigin().then((pos:any) => {
      //Make a marker for the map if modal is visible
      let crd = pos.coords;
      this.lat = this.originLat = crd.latitude;
      this.lng = this.originLng = crd.longitude;
      this.setMapZoom();
      this.placeMarkerAndCircle();
      this.map.setCenter({lat: this.lat, lng: this.lng});
    }).catch(error => {
      this.lat = this.originLat = environment.locationDefault.lat;
      this.lng =this.originLng = environment.locationDefault.lng;
      this.setMapZoom();
      this.placeMarkerAndCircle();
      this.map.setCenter({lat: this.lat, lng: this.lng});
    });
  }

  setMapZoom(){
    switch(this.dist * 1) {
        case 0.5:
            this.map.setZoom(13);
            break;
        case 1:
            this.map.setZoom(13);
            break;
        case 2:
            this.map.setZoom(12);
            break;
        case 5:
            this.map.setZoom(11);
            break;
        case 10:
            this.map.setZoom(10);
            break;
        case 20:
            this.map.setZoom(9);
            break;
        default:
            this.map.setZoom(13);
    }
  }

  placeMarkerAndCircle(){
    if(this.marker){
      this.marker.setPosition({lat: this.lat, lng: this.lng});
      this.circle.setCenter({lat: this.lat, lng: this.lng});
      this.circle.setRadius(this.dist * 1609.34);
    }else{
      this.marker = new google.maps.Marker({
        map: this.map,
        //anchorPoint: new google.maps.Point(latitude, longitude),
        position: {lat: this.lat, lng: this.lng}
      });
      this.circle.setCenter({lat: this.lat, lng: this.lng});
      this.circle.setRadius(this.dist * 1609.34);
    }
  }

  private clickReceived(event){
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    this.lat = latitude;
    this.lng = longitude;
    this.placeMarkerAndCircle();
  }

  distanceChanged(){
    this.setMapZoom();
    this.placeMarkerAndCircle();
    this.map.setCenter({lat: this.lat, lng: this.lng});
  }

  private geocodeLatLng():Promise<any> {
    return new Promise((resolve, reject) => {
      var latlng = {lat: this.lat, lng: this.lng};
      this.geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            let locationDetails = <any>{};
            for (let component of results[1].address_components){
              locationDetails[component.types[0]] = component.long_name;
            }
            let locationProps = {
              lat: this.lat,
              lng: this.lng,
              dist: this.dist,
              city: locationDetails.locality,
              neighborhood: locationDetails.neighborhood,
              state: locationDetails.administrative_area_level_1,
              postal_code: locationDetails.postal_code,
              country: locationDetails.country
            };
            resolve(locationProps);
          } else {
            reject('No results found.');
          }
        } else {
          reject('Geocoder failed due to: ' + status);
        }
      }.bind(this));
    });
  }

  private populateMap(){
    //Get map points for events today
    this.eventService.getEventsAllCurrentPoints().then(points => {
      let allBounds = new google.maps.LatLngBounds();
      let insideBounds = new google.maps.LatLngBounds();

      // this.circle = new google.maps.Circle({
      //   strokeColor: '#FF0000',
      //   strokeOpacity: 0.8,
      //   strokeWeight: 2,
      //   fillOpacity:0.1,
      //   center: {lat: this.locationService.getLat(), lng: this.locationService.getLng()},
      //   radius: this.locationService.getDistMeters(),
      //   map: this.map
      // });

      for(let point of points){
        let icon:any;
        //Outside of distance
        // if(point.distance > this.locationService.getDistMeters()){
        //   icon = {
        //     path: google.maps.SymbolPath.CIRCLE,
        //     scale:4,
        //     fillColor: '#125ebc',
        //     fillOpacity:0.8,
        //     strokeColor:'#fff',
        //     strokeWeight:1,
        //     strokeOpacity:1
        //   };
        // }else{
        //   //Marker inside of user's chosen distance
        //   icon = {
        //     path: google.maps.SymbolPath.CIRCLE,
        //     scale:4,
        //     fillColor: '#ff0000',
        //     fillOpacity:0.8,
        //     strokeColor:'#fff',
        //     strokeWeight:1,
        //     strokeOpacity:1
        //   }
        // }

        icon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale:4,
          fillColor: '#125ebc',
          fillOpacity:0.8,
          strokeColor:'#fff',
          strokeWeight:1,
          strokeOpacity:1
        };

        let marker = new google.maps.Marker({
          map: this.map,
          icon: icon,
          position: {lat: +point.lat, lng: +point.lng}
        });

        this.markers.push(marker);
        allBounds.extend(marker.getPosition());
        if(point.distance > this.locationService.getDistMeters()){
          insideBounds.extend(marker.getPosition());
        }
      }
      //MARK: These allow us to change map bounds. Just uncomment the one you want
      //this.map.fitBounds(allBounds);
      //this.map.fitBounds(insideBounds);
      this.map.fitBounds(this.circle.getBounds());
      //This will make the map work when the flex box wraps map to top on page load
      google.maps.event.trigger(this.map, 'resize');
    }).catch(error => console.log(error));
  }

}
