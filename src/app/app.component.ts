import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Router }   from '@angular/router';
import { AuthService } from './_services/auth.service';
import { LocationService } from './_services/location.service';
import { Subscription }   from 'rxjs/Subscription';

declare var google:any;
const geolocationOptions = {
      enableHighAccuracy: true, //will be more accurate but might take longer and uses more power
      timeout: 5000,
      maximumAge:0
    }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./_components/modal.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'MBT';
  subscription: Subscription;
  loggedIn: boolean;
  map:any;
  lat:number;
  lng:number;
  geocoder:any;
  userLocation = 'Choose location';
  locationModalVisible = false;

  constructor( private authService: AuthService, private _ngZone:NgZone, private router:Router, private locationService:LocationService){}

  ngOnInit(){
    //set location name
    this.userLocation = this.locationService.getLocationName();
    //set the logged in property
    this.loggedIn = this.authService.isLoggedIn();
    //listen to when the loggen in property changes
    this.subscription = this.authService.loggedIn$.subscribe(loggedInValue => {
        this._ngZone.run(() =>
          this.loggedIn = loggedInValue
        );
    });

    if(window.navigator.geolocation && this.locationService.getLocationType() == 'current'){
        //window.navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), geolocationOptions);
    };

    //Google map stuff
    this.geocoder = new google.maps.Geocoder;

    //Google map stuff
    var origin = {lat: 41.94, lng: -87.68};
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: origin,
      zoom: 13
    });

    this.map.addListener("click", function (event) {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        this.lat = latitude;
        this.lng = longitude;

        if(this.marker){
          this.marker.setPosition({lat: latitude, lng: longitude});
        }else{
          this.marker = new google.maps.Marker({
            map: this.map,
            //anchorPoint: new google.maps.Point(latitude, longitude),
            position: {lat: latitude, lng: longitude}
          });
        }
    }.bind(this));
  }

  selectLocation(){
    if(this.lat && this.lng){
      this.geocodeLatLng(this.lat, this.lng);
    }
  }

  success(pos) {
    //make the current location the chosen one
    let crd = pos.coords;
    this.geocodeLatLng(crd.latitude, crd.longitude);
  };

  error(err) {
    //console.warn(`ERROR(${err.code}): ${err.message}`);
    //user denied geolocation
    if(err.code == 1){
      //this.selectLocation = true;
    }
  };

  geocodeLatLng(lat, lng):void {
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
          this.locationService.setCurrentLocation(locationProps);
          this.locationService.useCurrentLocation();
          //set user location text
          this.userLocation = this.locationService.getLocationName();
          this._ngZone.run(() => {
            //emit location change event
            this.locationService.locationSource.next(true);
          });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    }.bind(this));
  }

  useCurrentLocation(){
    if(!this.locationService.hasCurrentLocation()){ //Ask for location if we don't have it
      window.navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), geolocationOptions);
    }
    //set location type
    this.locationService.useCurrentLocation();
    //get location name
    this.userLocation = this.locationService.getLocationName();
    //emit location change event
    this.locationService.locationSource.next(true);
  }

  useSelectLocation(){
    if(!this.locationModalVisible){ //showing the modal
      if(!this.locationService.hasCurrentLocation()){ //Ask for location if we don't have it
        window.navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), geolocationOptions);
      }
    }
    //toggle location modal
    this.locationModalVisible = !this.locationModalVisible;
    //this.locationService.useSelectedLocation();
    //this.locationService.locationSource.next(true);
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }

  redirectToSearch(){
    this.router.navigate(['search']);
  }
}
