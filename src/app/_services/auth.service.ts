import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { Subject }    from 'rxjs/Subject';

import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

declare var gapi: any;
declare var fbAsyncInit:any;
declare var window:any;
declare var FB:any;

@Injectable()

export class AuthService {
  constructor(private http: Http,private router:Router) {}

  private loggedInSource = new Subject<boolean>();

  loggedIn$ = this.loggedInSource.asObservable();
  accessToken:string;
  authUrl = environment.authServer;

  //helpers
  isLoggedIn(){
    if (localStorage.getItem('token')) {
        // logged in so return true
        console.log('you are logged in');
        return true;
    }
    console.log('you are not logged in');
    return false;
  }
  
  login(token: string){
    localStorage.setItem('token', token);
    this.loggedInSource.next(true);
    //redirect
    this.router.navigate(['/dashboard']);
  }

  logout(){
    localStorage.removeItem('token');
    this.loggedInSource.next(false);
    //redirect
    this.router.navigate(['/login']);
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
  facebookLogin2(){
    let self = this;
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        let accessToken = response.authResponse.accessToken;
        self.getJWT('facebook', accessToken).then(
          token => self.login(token)
        ).catch(
          error => console.log(error)
        )
      }
      else {
        console.log('there was an error');
      }
    });
  }
  //handle facebook response
  facebookLogin(){
    let self = this;
    setTimeout(function() {
      self.login('1334');
    }, 2000);
  }

  //Google login stuff
  auth2: any;
  googleInit(googleBtnId:string) {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: '49563587913-aaa8ved79pe65df884an1peset2me3vu.apps.googleusercontent.com',
        //cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      that.attachSignin(document.getElementById(googleBtnId));
    });
  }
  public attachSignin(element) {
    let that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {

        //let profile = googleUser.getBasicProfile(); //profile info
        let authResponse = googleUser.getAuthResponse();
        that.getJWT('google', authResponse.access_token).then(
          token => that.login(token)
        ).catch(
          () => console.log('something went wrong') 
        );
      }, function (error) {
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