import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
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

  getEventsEditable(page=1, perpage=100):Promise<any>{
    return this.httpHandlerService.get(`event/editable?page=${page}&pp=${perpage}`)
      .toPromise()
  }

  getEvent(id:number){
    return this.httpHandlerService.get(`event/${id}`)
      .map(response => response.json().data)
      .toPromise()
  }

  getEventEdit(id:number){
    return this.httpHandlerService.get(`event/${id}/edit`)
      .map(response => response.json().data)
      .toPromise()
  }

  updateEvent(params):Promise<any>{
    return this.httpHandlerService.put(`event/${params.id}`, params)
      .toPromise();
  }

  createEvent(params):Promise<any>{
    return this.httpHandlerService.post('event', params)
      .map(response => response.json().data)
      .toPromise();
  }

  deleteEvent(id):Promise<any>{
    return this.httpHandlerService.delete(`event/${id}`)
      .map(response => response.json().data)
      .toPromise();
  }

  getVenueTimezone(lat,lng,timestamp){
    let path = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${environment.googleTimezoneKey}`;
    return this.http.get(path)
      .map(response => response.json())
      .toPromise();
  }

  s3SaveImage(s3Credentials, url, file){
    let body = new FormData();
    for(let key in s3Credentials){
      body.append(key,s3Credentials[key]);
    }
    let image = this.dataURItoBlob(file, 'image/jpeg');
    body.append('file', image);
    return this.http.post(url, body);
  }


  private dataURItoBlob(dataURI, type) {
      // convert base64 to raw binary data held in a string
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var bb = new Blob([ab], { type: type });
      return bb;
  }

  //Attach image url to event
  saveImageUrl(eventId, imageUrl){
    let path = `event/${eventId}`;
    let body = {
      'imageurl':imageUrl
    }
    return this.httpHandlerService.put(path, body)
      .map(response => response.json())
      .toPromise();
  }

  addParticipant(id, participant){
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

  addShow(id,show){
    let options = {
      'show_id':show.id
    }
    let path = `event/${id}/shows`;
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

  getS3Key(eventId){
    let path = `signupload/event/${eventId}/main`;
    return this.httpHandlerService.get(path)
      .map(response => response.json())
      .toPromise();
  }
}