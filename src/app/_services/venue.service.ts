import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { HttpHandlerService } from './http-handler.service';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class VenueService {
  constructor(
    private http: Http,
    private router:Router,
    private httpHandlerService: HttpHandlerService
  ){}
  /*
  getVenues():Promise<any>{
    return this.httpHandlerService.get('venue')
      .catch(error => Promise.reject('Could not get venues'));
  }
  */
  
  getVenues():Promise<any>{
    return this.httpHandlerService.get('venue')
      .toPromise();
  }
  
}