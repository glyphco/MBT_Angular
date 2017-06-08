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
  private maxAttempts = 6; //how many times to retry when accessable is false
  
  /*
  get2(url):Promise<any>{
    let token = localStorage.getItem('token');
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('X-Requested-With', 'XMLHttpRequest');
    let options = new RequestOptions({ headers: headers });
    let path = `${this.apiurl}/${url}`;
    let response = this.http.get(path, options)
      .toPromise()
      .catch(error => this.handleError(error));
    return response;
  }

  //fake get call for right now
  get3(url) {
    let path = 'http://aro.admin.dev/tests/get';
    let response = this.http.get(path)
      .map(response => {
        console.log('this is the response');
        console.log(response);
    });
      
      .subscribe(error => this.handleError(error))
      .unsubscribe();
    return response;
  }

  get4(url, checkToken=true):Promise<any>{
    console.log('got called');
    let tokenExpires = parseInt(localStorage.getItem('tokenExpires'));
    let timestamp = new Date().getTime() / 1000 | 0;
    if((tokenExpires - timestamp)/60 >= environment.refreshWindow && checkToken){
      return this.authService.refreshToken()
        .then(()=> { Promise.resolve({'hi': 'there'}) })
        .catch(error => { return this.handleError(error) });
    }else{
      return Promise.resolve({'this':'skipped'});
      
      console.log('doing the get');
      let path = 'http://aro.admin.dev/tests/get';
      return this.http.get(path)
        .toPromise()
        .catch(error => this.handleError(error));
    }
  }
  
  getWorking(url, checkToken=true):Promise<any>{
    return new Promise((resolve, reject) => {
      let tokenExpires = parseInt(localStorage.getItem('tokenExpires'));
      let timestamp = new Date().getTime() / 1000 | 0;
      //if the token has expired, refresh the token before sending the request
      if((tokenExpires - timestamp)/60 <= environment.refreshWindow && checkToken){
        this.authService.refreshToken()
          .then(()=> { 
            resolve(this.get(url, false)
              .then(response => resolve(response))
              .catch(error => reject('Could not get venues')))
          })
          .catch(error => { reject('Could not refresh token') });
      }else{
        //Send the request
        let token = localStorage.getItem('token');
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);
        headers.append('X-Requested-With', 'XMLHttpRequest');
        let options = new RequestOptions({ headers: headers });
        let path = `${this.apiurl}/${url}`;
        this.http.get(path, options)
          .toPromise()
          .then(response => resolve(response))
          .catch(error => reject('Could not get venues'));
      }
    });
  }*/

  //TODO: make this private
  public setAccessable(value:boolean):void{
    this.accessable = value;
    this.accessSource.next(value);
  }

  private getOptions():RequestOptions{
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

  get(url, checkToken=true):Observable<any>{
    let path = `${this.apiurl}/${url}`;
    if(this.tokenExpired() && this.accessable == true){
      //token bad & no wait
      //pause all other requests
      this.accessable = false;
      //get a new token and then complete request
      return this.authService.refreshToken()
        .mergeMap((response) => {
          this.accessable = true;
          let options = this.getOptions();
          return this.http.get(path, options);
        })
    } else if(this.accessable == true) {
      //token good & no wait
      let options = this.getOptions();
      return this.http.get(path, options);
    } else {
      let options = this.getOptions(); //this HAS to be inside the else
      return this.accessStream$
              .mergeMap(access => {
                console.log(access);
                if(access == true){
                  let options = this.getOptions();
                  return this.http.get(path, options);
                }
              }).first();
    }
  }

  //fake error handler for testing
  handleError(error: any){
    return Promise.reject('There was an error.');
  }
}