import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router }   from '@angular/router';
import { AuthService } from './_services/auth.service';
import { LocationService } from './_services/location.service';
import { MeService } from './_services/me.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./_components/modal.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MBT';
  subscription: Subscription;
  loggedIn:boolean;
  map:any;
  lat:number;
  lng:number;
  dist = 0.5;
  geocoder:any;
  marker:any;
  circle:any;
  userLocation = 'Choose location';
  locationModalVisible = false;
  locationPickerVisible = false;
  routerOutletVisible = true;
  get username() {
    return this.meService.firstName;
  }
  get userimage(){
    return this.meService.profilePicture;
    //return localStorage.getItem('avatar') ? localStorage.getItem('avatar') : 'assets/images/default_user.png';
  }

  constructor( 
    private authService: AuthService, 
    private _ngZone:NgZone, 
    private router:Router, 
    private locationService:LocationService,
    private meService:MeService){}

  ngOnInit(){
    //check if me service is instantiated
    this.meService.initializeMe();

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
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  selectLocation(){
    //toggle location modal
    this.locationPickerVisible = !this.locationPickerVisible;
    this.routerOutletVisible = !this.routerOutletVisible;
  }

  logout(){
    this.authService.logout();
  }

  redirectToSearch(){
    this.router.navigate(['search']);
  }
}
