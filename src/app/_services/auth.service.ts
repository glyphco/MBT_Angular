import { Injectable, NgZone, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable }    from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';
import { JwtHelperService } from './jwt-helper.service';
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

  loginOriginal(){
    //redirect
    this._zone.run(() => {
      this.router.navigate(['/events/today']);
    });
    this.loggedInSource.next(true);
  }

  login(token){
    //store token and tokenexpires
    this.saveToken(token);
    //emit login event
    this.loggedInSource.next(true);
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpires');
    this.loggedInSource.next(false);
    //redirect
    this.router.navigate(['/login']);
  }

  private saveToken(token){
    let parsedToken = this.jwtHelperService.decodeToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpires', parsedToken.exp);
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