import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class HttpHandlerService {
  constructor(private http: Http, private authService: AuthService) {}
  private apiurl = environment.apiServer;

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
      /*
      .subscribe(error => this.handleError(error))
      .unsubscribe();*/
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
      /*
      console.log('doing the get');
      let path = 'http://aro.admin.dev/tests/get';
      return this.http.get(path)
        .toPromise()
        .catch(error => this.handleError(error));*/
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
  }

  get(url, checkToken=true):Observable<any>{
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
  }

  //fake error handler for testing
  handleError(error: any){
    return Promise.reject('There was an error.');
  }
}