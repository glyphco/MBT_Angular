import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { HttpHandlerService } from './http-handler.service';
import { environment } from '../../environments/environment';
import { Event } from '../_models/event';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class EventService {
  constructor(
    private http: Http,
    private router:Router,
    private httpHandlerService: HttpHandlerService
  ){}

  getEvents(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`event?page=${page}&pp=${perpage}`)
      .toPromise()
  }

  getEvent(id:number){
    return this.httpHandlerService.get(`event/${id}`)
      .toPromise()
  }

  updateEvent(event:Event):Promise<any>{
    let id = event.id;
    let options = {
      //TODO: could put all the trimming into the http service as a function
      //can't trim numbers though (i think)
      name: event.name,
      description: event.description
    }
    return this.httpHandlerService.put(`event/${id}`, options)
      .toPromise();
  }

  createEvent(params):Promise<any>{
    return this.httpHandlerService.post('event', params)
      .map(response => response.json().data)
      .toPromise();
  }

  getVenueTimezone(lat,lng,timestamp){
    let path = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${environment.googleTimezoneKey}`;
    return this.http.get(path)
      .map(response => response.json())
      .toPromise();
  }

  addParticipant(id, participant){
    console.log(participant);
    let options = {
      'event_id' : id,
      'name':participant.name,
      'info':participant.description,
      'page_id':participant.id > 0 ? participant.id : undefined,
      'start':participant.startTime
    }
    let path = `event/${id}/participants`;
    return this.httpHandlerService.post(path, options)
      .map(response => response.json())
      .toPromise();
  }

  addCategory(eventId, parentCategory, subCategory){
    let path = `event/${eventId}/categories`;
    let options = {
      'category_id':parentCategory,
      'subcategory_id':subCategory
    };
    return this.httpHandlerService.post(path, options)
      .toPromise();
  }
}