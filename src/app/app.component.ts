import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Router }   from '@angular/router';
import { AuthService } from './_services/auth.service';
import { Subscription }   from 'rxjs/Subscription';

declare var google:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'MBT';
  subscription: Subscription;
  loggedIn: boolean;
  geocoder:any;
  selectLocation = false;

  constructor( private authService: AuthService, private _ngZone:NgZone, private router:Router){}

  ngOnInit(){
    //set the logged in property
    this.loggedIn = this.authService.isLoggedIn();
    //listen to when the loggen in property changes
    this.subscription = this.authService.loggedIn$.subscribe(loggedInValue => {
        this._ngZone.run(() =>
          this.loggedIn = loggedInValue
        );
    });
    let options = {
      enableHighAccuracy: true, //will be more accurate but might take longer and uses more power
      timeout: 5000,
      maximumAge:0
    }

    if(window.navigator.geolocation){
        window.navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), options);
    };

    //Google map stuff
    this.geocoder = new google.maps.Geocoder;
  }

  success(pos) {
    let crd = pos.coords;
    //store lat,lng in localStorage
    localStorage.setItem('lat', crd.latitude);
    localStorage.setItem('lng', crd.longitude);
    this.geocodeLatLng(crd.latitude, crd.longitude);
  };

  error(err) {
    //console.warn(`ERROR(${err.code}): ${err.message}`);
    //user denied geolocation
    if(err.code == 1){
      this.selectLocation = true;
    }
  };

  geocodeLatLng(lat, lng):void {
    let self = this;
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    this.geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          let locationDetails = <any>{};
          for (let component of results[1].address_components){
            locationDetails[component.types[0]] = component.long_name;
          }
          localStorage.setItem('city', locationDetails.locality);
          localStorage.setItem('neighborhood', locationDetails.neighborhood);
          localStorage.setItem('state', locationDetails.administrative_area_level_1);
          localStorage.setItem('postal_code', locationDetails.postal_code);
          localStorage.setItem('country', locationDetails.country);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }
  
  redirectToDashboard(){
    this.router.navigate(['dashboard']);
  }

  redirectToSearch(){
    this.router.navigate(['search']);
  }
}
