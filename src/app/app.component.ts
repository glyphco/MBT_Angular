import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor( private authService: AuthService){
    
  }

  ngOnInit(){
    this.loggedIn = this.authService.isLoggedIn();
    this.subscription = this.authService.loggedIn$.subscribe(
      loggedInValue => {
        this.loggedIn = loggedInValue;
        console.log('we just got that you might have changed');
        console.log(loggedInValue);
      });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }
}
