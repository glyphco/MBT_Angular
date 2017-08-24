import { Injectable, Inject } from '@angular/core';
import { AuthService } from './auth.service';
import { DOCUMENT } from '@angular/platform-browser';

declare var gapi: any;
declare var fbAsyncInit:any;
declare var window:any;
declare var FB:any;

@Injectable()

export class SocialLoginService {
  private auth2:any;

  constructor(
    private authService:AuthService,
    @Inject(DOCUMENT) private document: Document
  ){}

  //initialize facebook and google apis
  public initProviders() {
    //initialize facebook api
    this.facebookInit();
    //initialize google api
    this.googleInit();
  }

  public facebookInit(){
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
    }(this.document, 'script', 'facebook-jssdk'));
  }

  public googleInit() {
    gapi.load('auth2', function () {
      this.auth2 = gapi.auth2.init({
        client_id: '49563587913-aaa8ved79pe65df884an1peset2me3vu.apps.googleusercontent.com',
        //cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
    }.bind(this));
  }

  public facebookLogin():Promise<any>{
    return new Promise((resolve,reject) => {
      FB.login(function(response){
        if(response.authResponse){
          let accessToken = response.authResponse.accessToken;
          return this.authService.getJWT('facebook', accessToken).then(token => {
            this.authService.login(token);
            resolve(true);
          }).catch(error => {
            reject(error);
          });
        } else {
          reject('User cancelled login or did not fully authorize.');
        }
      }.bind(this))
    });
  }

  public googleLogin():Promise<any>{
    return new Promise((resolve, reject) => {
      this.startGoogleLoginPrompt().then(response => {
        let authResponse = response.getAuthResponse();
        return this.authService.getJWT('google', authResponse.access_token);
      }).then(token => {
        this.authService.login(token);
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  private startGoogleLoginPrompt():Promise<any>{
    let options = {};
    return new Promise((resolve, reject) => {
      resolve(this.auth2.signIn(options));
    });
  }

  private showLoading(){
    //indicate that the page is loading
    this.document.body.style.opacity = "0.5";
  }
  private hideLoading(){
    //indicate that the page is loading
    this.document.body.style.opacity = "1";
  }
}