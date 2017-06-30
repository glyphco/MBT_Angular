import { Component, OnInit, NgZone, Input } from '@angular/core';

declare var google:any;

@Component({
  selector: 'set-location',
  templateUrl: './set-location.component.html',
  styleUrls: ['./set-location.component.css']
})
export class SetLocationComponent implements OnInit {
  showPopup = true;
  map:any;
  marker:any;
  lat:number;
  lng:number;
  geocoder:any;
  errors = [];

  constructor(private _ngZone:NgZone){}

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
          console.log(locationDetails);
          localStorage.setItem('sel_city', locationDetails.locality);
          localStorage.setItem('sel_neighborhood', locationDetails.neighborhood);
          localStorage.setItem('sel_state', locationDetails.administrative_area_level_1);
          localStorage.setItem('sel_postal_code', locationDetails.postal_code);
          localStorage.setItem('sel_country', locationDetails.country);
          self._ngZone.run(() => self.showPopup = false);
        } else {
          this.errors.push('No results found');
        }
      } else {
        this.errors.push('Geocoder failed due to: ' + status)
      }
    });
  }
}
