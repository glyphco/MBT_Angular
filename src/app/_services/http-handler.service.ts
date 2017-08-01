import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Observable }    from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { JwtHelperService } from './jwt-helper.service';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise'; //TODO might need to remove this
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';

@Injectable()

export class HttpHandlerService {
  constructor(private http: Http, private jwtHelperService:JwtHelperService) {}
  private apiUrl = environment.apiServer;
  private authUrl = environment.authServer;
  private accessSource = new Subject<boolean>();
  private accessable = true; //if requests are able to go out
  private accessStream$ = this.accessSource.asObservable();

  private setAccessable(value:boolean):void{
    this.accessable = value;
    this.accessSource.next(value);
  }

  private getHeaders():RequestOptions{
    let token = localStorage.getItem('token');
    let headers = new Headers();
    if(token){
      headers.append('Authorization', `Bearer ${token}`);
    }
    headers.append('X-Requested-With', 'XMLHttpRequest');
    return new RequestOptions({ headers: headers });
  }

  private tokenExpired():boolean { //MARK: This is where I left off
    let tokenExpires = parseInt(localStorage.getItem('tokenExpires')); //TODO: figure out what to do if key isn't in storage
    if(!localStorage.getItem('token')){
      return false;
    }
    let timestamp = new Date().getTime() / 1000 | 0; 
    return (tokenExpires - timestamp)/60 <= environment.refreshWindow;
  }

  private trimOptions(obj) {
    for (var prop in obj) {
      var value = obj[prop], type = typeof value;
      if (value != null && (type == "string" || type == "object") && obj.hasOwnProperty(prop)) {
        if (type == "object") {
          obj[prop] = this.trimOptions(obj[prop]);
        } else {
          obj[prop] = obj[prop].trim();
        }
      }
    }
    return obj;
  }

  get(url):Observable<any>{
    let path = `${this.apiUrl}/${url}`;
    if(this.tokenExpired() && this.accessable == true){
      //token bad & no wait
      //pause all other requests
      this.accessable = false;
      //get a new token and then complete request
      return this.refreshToken()
        .mergeMap((response) => {
          this.setAccessable(true);
          let headers = this.getHeaders();
          return this.http.get(path, headers);
        })
    } else if(this.accessable == true) {
      //token good/no token & no wait
      let headers = this.getHeaders();
      return this.http.get(path, headers);
    } else {
      let headers = this.getHeaders(); //this HAS to be inside the else
      return this.accessStream$
              .mergeMap(access => {
                if(access == true){
                  let headers = this.getHeaders();
                  return this.http.get(path, headers);
                }
              }).first();
    }
  }

  put(url, options){
    let path = `${this.apiUrl}/${url}`;
    options = this.trimOptions(options);
    if(this.tokenExpired() && this.accessable == true){
      //token bad & no wait
      //pause all other requests
      this.accessable = false;
      //get a new token and then complete request
      return this.refreshToken()
        .mergeMap((response) => {
          this.setAccessable(true);
          let headers = this.getHeaders();
          return this.http.put(path, options, headers);
        })
    } else if(this.accessable == true) {
      //token good/no token & no wait
      let headers = this.getHeaders();
      return this.http.put(path, options, headers);
    } else {
      let headers = this.getHeaders(); //this HAS to be inside the else
      return this.accessStream$
              .mergeMap(access => {
                if(access == true){
                  let headers = this.getHeaders();
                  return this.http.put(path, options, headers);
                }
              }).first();
    }
  }

  post(url:string, options){
    let path = `${this.apiUrl}/${url}`;
    options = this.trimOptions(options);
    if(this.tokenExpired() && this.accessable == true){
      //token bad & no wait
      //pause all other requests
      this.accessable = false;
      //get a new token and then complete request
      return this.refreshToken()
        .mergeMap((response) => {
          this.setAccessable(true);
          let headers = this.getHeaders();
          return this.http.post(path, options, headers);
        })
    } else if(this.accessable == true) {
      //token good/no token & no wait
      let headers = this.getHeaders();
      return this.http.post(path, options, headers);
    } else {
      let headers = this.getHeaders(); //this HAS to be inside the else
      return this.accessStream$
              .mergeMap(access => {
                if(access == true){
                  let headers = this.getHeaders();
                  return this.http.post(path, options, headers);
                }
              }).first();
    }
  }

  delete(url):Observable<any>{
    let path = `${this.apiUrl}/${url}`;
    if(this.tokenExpired() && this.accessable == true){
      //token bad & no wait
      //pause all other requests
      this.accessable = false;
      //get a new token and then complete request
      return this.refreshToken()
        .mergeMap((response) => {
          this.setAccessable(true);
          let headers = this.getHeaders();
          return this.http.delete(path, headers);
        })
    } else if(this.accessable == true) {
      //token good/no token & no wait
      let headers = this.getHeaders();
      return this.http.delete(path, headers);
    } else {
      let headers = this.getHeaders(); //this HAS to be inside the else
      return this.accessStream$
              .mergeMap(access => {
                if(access == true){
                  let headers = this.getHeaders();
                  return this.http.delete(path, headers);
                }
              }).first();
    }
  }

  private refreshToken():Observable<any>{
    let token = localStorage.getItem('token');
    const path = `${this.authUrl}/refreshJWT?token=${token}`;
    return this.http.get(path)
            .map(response => {
              let  headers = response.headers;
              let newToken = headers.get('Authorization').substr(7);
              let parsedToken = this.jwtHelperService.decodeToken(newToken);
              localStorage.setItem('token', newToken);
              localStorage.setItem('tokenExpires', parsedToken.exp);
            });
  }

  //TODO: fake error handler for testing
  handleError(error: any){
    return Promise.reject('There was an error.');
  }
}