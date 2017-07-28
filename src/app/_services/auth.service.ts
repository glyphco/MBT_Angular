import { Injectable, NgZone } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
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
  constructor(
    private http: Http,
    private router:Router,
    private jwtHelperService:JwtHelperService,
    private httpHandlerService:HttpHandlerService,
    private meService:MeService,
    private _zone:NgZone){}
  
  private token = '';
  private loggedInSource = new Subject<boolean>();
  loggedIn$ = this.loggedInSource.asObservable();
  authUrl = environment.authServer;

  isLoggedIn(){
    if (localStorage.getItem('token')) {
        // logged in so return true
        return true;
    }
    return false;
  }

  login(token: string){
    //redirect
    this._zone.run(() => {
      this.router.navigate(['/backstage']);
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
  initProviders(googleBtnId:string) {
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
    this.googleInit(googleBtnId);
  }

  //handle facebook response
  facebookLogin(){
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        let accessToken = response.authResponse.accessToken;
        this.getJWT('facebook', accessToken).then(token => {
          this.saveToken(token);
          return this.meService.initializeMe();
        }).then(user => {
          this._zone.run(() => 
            this.login()
          );
        }).catch(
          error => console.log(error)
        )
      }
      else {
        console.log('there was an error');
      }
    }.bind(this));
  }

  //Google login stuff
  auth2: any;
  googleInit(googleBtnId:string) {
    gapi.load('auth2', function () {
      this.auth2 = gapi.auth2.init({
        client_id: '49563587913-aaa8ved79pe65df884an1peset2me3vu.apps.googleusercontent.com',
        //cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById(googleBtnId));
    }.bind(this));
    gapi.signin2.render(googleBtnId, {
      'width': 300,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {
        //let profile = googleUser.getBasicProfile(); //profile info
        let authResponse = googleUser.getAuthResponse();
        this.getJWT('google', authResponse.access_token).then(
          token => this.login(token)
        ).catch(
          () => console.log('something went wrong') 
        );
      }.bind(this), function (error) {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  getJWT(provider: string, accessToken: string):Promise<string>{
    const url = `${this.authUrl}/gettoken/${provider}?token=${accessToken}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().JWT as string)
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    //console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}