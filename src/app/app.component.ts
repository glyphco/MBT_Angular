import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Router }   from '@angular/router';
import { AuthService } from './_services/auth.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'MBT';
  subscription: Subscription;
  loggedIn: boolean;

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
