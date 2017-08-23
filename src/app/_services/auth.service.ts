import { Injectable, NgZone, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable }    from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';
import { JwtHelperService } from './jwt-helper.service';
import { HttpHandlerService } from './http-handler.service';
import { MeService } from './me.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

declare var gapi: any;
declare var fbAsyncInit:any;
declare var window:any;
declare var FB:any;

@Injectable()

export class AuthService {  
  private token = '';
  private loggedInSource = new Subject<boolean>();
  loggedIn$ = this.loggedInSource.asObservable();
  authUrl = environment.authServer;

  constructor(
    private http: Http,
    private router:Router,
    private jwtHelperService:JwtHelperService,
    private httpHandlerService:HttpHandlerService,
    private meService:MeService,
    private _zone:NgZone,
    @Inject(DOCUMENT) private document: Document
  ){}

  isLoggedIn(){
    if (localStorage.getItem('token')) {
        // logged in so return true
        return true;
    }
    return false;
  }

  login(){
    //redirect
    this._zone.run(() => {
      this.router.navigate(['/events/today']);
    });
    this.loggedInSource.next(true);
  }

  logout(){
    localStorage.removeItem('token');
    this.loggedInSource.next(false);
    //redirect
    this.router.navigate(['/login']);
  }

  private saveToken(token){
    let parsedToken = this.jwtHelperService.decodeToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpires', parsedToken.exp);
  }

  //initialize facebook and google apis
  initProviders() {
    //initialize facebook api
    window.fbAsyncInit = function() {
        FB.init({
        appId            : '1794936930724080',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.9'
        });
        FB.AppEvents.logPageView();
    };
    
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    //initialize google api
    this.googleInit();
  }

  facebookLogin(){
    FB.login(function(response){
      this.showLoading();
      if(response.authResponse){
        let accessToken = response.authResponse.accessToken;
        this.getJWT('facebook', accessToken).then(token => {
          this.saveToken(token);
          return this.meService.initializeMe();
        }).then(user => {
          this.hideLoading();
          this._zone.run(() => 
            this.login()
          );
        }).catch(error => { 
          this.hideLoading();
          console.log(error);
        })
      } else {
        this.hideLoading();
        console.log('User cancelled login or did not fully authorize.');
      }
    }.bind(this))
  }

  //Shows facebook login dialog box if user isn't already signed in
  private redirectUserToFacebook(){
    FB.login(function(response){
      if(response.authResponse){
        let accessToken = response.authResponse.accessToken;
        this.getJWT('facebook', accessToken).then(token => {
          this.saveToken(token);
          return this.meService.initializeMe();
        }).then(user => {
          this.hideLoading();
          this._zone.run(() => 
            this.login()
          );
        }).catch(error => { 
          this.hideLoading();
          console.log(error);
        })
      } else {
        this.hideLoading();
        console.log('User cancelled login or did not fully authorize.');
      }
    }.bind(this))
  }

  //Google login stuff
  auth2: any;
  googleInit() {
    gapi.load('auth2', function () {
      this.auth2 = gapi.auth2.init({
        client_id: '49563587913-aaa8ved79pe65df884an1peset2me3vu.apps.googleusercontent.com',
        //cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
    }.bind(this));
  }

  googleLogin(){
    this.showLoading()
    this.loginGoogle().then(response => {
      let authResponse = response.getAuthResponse();
      return this.getJWT('google', authResponse.access_token);
    }).then(token => {
      this.saveToken(token);
      return this.meService.initializeMe();
    }).then(user => {
      this.hideLoading();
      this._zone.run(() => 
        this.login()
      );
    }).catch(() => {
      this.hideLoading();
      console.log('Something went wrong when getting JWT token from API or user closed Google popup');
    });
  }

  private loginGoogle():Promise<any>{
    let options = {};
    return new Promise((resolve, reject) => {
      resolve(this.auth2.signIn(options));
    });
  }

  getJWT(provider: string, accessToken: string):Promise<string>{
    const url = `${this.authUrl}/gettoken/${provider}?token=${accessToken}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().JWT as string)
      .catch(this.handleError)
  }

  private showLoading(){
    //indicate that the page is loading
    document.body.style.opacity = "0.5";
  }
  private hideLoading(){
    //indicate that the page is loading
    document.body.style.opacity = "1";
  }

  private handleError(error: any): Promise<any> {
    //console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}