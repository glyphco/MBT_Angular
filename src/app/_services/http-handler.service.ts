import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { AuthService } from './auth.service';
import { Observable }    from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise'; //TODO might need to remove this
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';

@Injectable()

export class HttpHandlerService {
  constructor(private http: Http, private authService: AuthService) {}
  private apiurl = environment.apiServer;
  private accessSource = new Subject<boolean>();
  private accessable = true; //if requests are able to go out
  private accessStream$ = this.accessSource.asObservable();

  private setAccessable(value:boolean):void{
    this.accessable = value;
    this.accessSource.next(value);
  }

  private  getHeaders():RequestOptions{
    let token = localStorage.getItem('token');
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('X-Requested-With', 'XMLHttpRequest');
    return new RequestOptions({ headers: headers });
  }

  private tokenExpired():boolean {
    let tokenExpires = parseInt(localStorage.getItem('tokenExpires')); //TODO: figure out what to do if key isn't in storage
    let timestamp = new Date().getTime() / 1000 | 0;
    return (tokenExpires - timestamp)/60 <= environment.refreshWindow;
  }

  get(url):Observable<any>{
    let path = `${this.apiurl}/${url}`;
    if(this.tokenExpired() && this.accessable == true){
      //token bad & no wait
      //pause all other requests
      this.accessable = false;
      //get a new token and then complete request
      return this.authService.refreshToken()
        .mergeMap((response) => {
          this.setAccessable(true);
          let headers = this. getHeaders();
          return this.http.get(path, headers);
        })
    } else if(this.accessable == true) {
      //token good & no wait
      let headers = this. getHeaders();
      return this.http.get(path, headers);
    } else {
      let headers = this. getHeaders(); //this HAS to be inside the else
      return this.accessStream$
              .mergeMap(access => {
                if(access == true){
                  let headers = this. getHeaders();
                  return this.http.get(path, headers);
                }
              }).first();
    }
  }

  put(url, options){
    let path = `${this.apiurl}/${url}`;
    if(this.tokenExpired() && this.accessable == true){
      //token bad & no wait
      //pause all other requests
      this.accessable = false;
      //get a new token and then complete request
      return this.authService.refreshToken()
        .mergeMap((response) => {
          this.setAccessable(true);
          let headers = this. getHeaders();
          return this.http.put(path, options, headers);
        })
    } else if(this.accessable == true) {
      //token good & no wait
      let headers = this. getHeaders();
      return this.http.put(path, options, headers);
    } else {
      let headers = this. getHeaders(); //this HAS to be inside the else
      return this.accessStream$
              .mergeMap(access => {
                if(access == true){
                  let headers = this. getHeaders();
                  return this.http.put(path, options, headers);
                }
              }).first();
    }
  }

  //TODO: fake error handler for testing
  handleError(error: any){
    return Promise.reject('There was an error.');
  }
}