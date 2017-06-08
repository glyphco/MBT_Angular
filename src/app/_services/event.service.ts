import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { HttpHandlerService } from './http-handler.service';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class EventService {
  constructor(
    private http: Http,
    private router:Router,
    private httpHandlerService: HttpHandlerService
  ){}
  /*
  getEvents(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`event?page=${page}&pp=${perpage}`)
      .catch(error => Promise.reject('Could not get events'));
  }*/

  getEvents(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`event?page=${page}&pp=${perpage}`)
      .toPromise()
  }

  turnOff(){
    this.httpHandlerService.setAccessable(false);
  }
  turnOn(){
    this.httpHandlerService.setAccessable(true);
  }
}