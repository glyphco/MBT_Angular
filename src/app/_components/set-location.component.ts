import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { LocationService } from '../_services/location.service';

declare var google:any;

@Component({
  selector: 'set-location',
  templateUrl: './set-location.component.html',
  styleUrls: ['./set-location.component.css', './modal.component.css']
})
export class SetLocationComponent implements OnInit {
  @Input() showPopup:boolean;
  @Output() closePopup = new EventEmitter<boolean>();
  @Output() selectedLocation = new EventEmitter<string>();
  map:any;
  marker:any;
  lat:number;
  lng:number;
  geocoder:any;
  errors = [];

  constructor(private _ngZone:NgZone, private locationService:LocationService){}

  ngOnInit():void{
    let self = this;
    var origin = {lat: 41.94, lng: -87.68};
    //Google map stuff
    this.geocoder = new google.maps.Geocoder;

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: origin,
      zoom: 13
    });

    this.map.addListener("click", function (event) {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        self.lat = latitude;
        self.lng = longitude;

        if(self.marker){
          self.marker.setPosition({lat: latitude, lng: longitude});
        }else{
          self.marker = new google.maps.Marker({
            map: self.map,
            //anchorPoint: new google.maps.Point(latitude, longitude),
            position: {lat: latitude, lng: longitude}
          });
        }
    });
  }

  selectLocation(){
    this.clearErrors();
    if(this.lat && this.lng){
      this.geocodeLatLng(this.lat, this.lng);
    }else{
      this.errors.push('Location must be chosen.');
    }
  }

  private clearErrors(){
    this.errors = [];
  }

  private geocodeLatLng(lat, lng):void {
    let self = this;
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    this.geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          let locationDetails = <any>{};
          for (let component of results[1].address_components){
            locationDetails[component.types[0]] = component.long_name;
          }
          let locationProps = {
            lat: lat,
            lng: lng,
            city: locationDetails.locality,
            neighborhood: locationDetails.neighborhood,
            state: locationDetails.administrative_area_level_1,
            postal_code: locationDetails.postal_code,
            country: locationDetails.country
          };
          self.locationService.setSelectedLocation(locationProps);
          //Output location name
          self._ngZone.run(() => {
            self.selectedLocation.emit(self.locationService.getLocationName());
            self.exitPopup();
          });
        } else {
          this.errors.push('No results found');
        }
      } else {
        this.errors.push('Geocoder failed due to: ' + status)
      }
    });
  }

  exitPopup(){
    this.showPopup = false;
    this.closePopup.emit(false);
  }
}
