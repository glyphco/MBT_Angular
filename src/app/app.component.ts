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
        window.navigator.geolocation.getCurrentPosition(this.success, this.error, options);
    };

    //Google map stuff
    this.geocoder = new google.maps.Geocoder;
  }

  success(pos) {
    console.log(pos);
    let crd = pos.coords;
    this.geocodeLatLng(crd.latitude, crd.longitude);
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  };

  error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  geocodeLatLng(lat, lng):void {
    let self = this;
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    this.geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          console.log(results[1].formatted_address);
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
