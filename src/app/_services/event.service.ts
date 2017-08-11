import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { HttpHandlerService } from './http-handler.service';
import { LocationService } from './location.service';
import { environment } from '../../environments/environment';
import { Event } from '../_models/event';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class EventService {
  constructor(
    private http: Http,
    private locationService: LocationService,
    private httpHandlerService: HttpHandlerService
  ){}

  getEvents(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`event?page=${page}&pp=${perpage}`)
      .toPromise()
  }

  getEventsEditable(page=1, perpage=100, options):Promise<any>{
    let query = this.httpHandlerService.serialize(options);
    return this.httpHandlerService.get(`event/editable?page=${page}&pp=${perpage}&${query}`)
      .toPromise()
  }

  getEvent(id:number){
    return this.httpHandlerService.get(`event/${id}`)
      .map(response => response.json().data)
      .toPromise()
  }

  //custom call for event view page
  getEventDetails(id:number){
    let lat = this.locationService.getLat();
    let lng = this.locationService.getLng();
    return this.httpHandlerService.get(`event/${id}/details?lat=${lat}&lng=${lng}`)
      .map(response => response.json().data)
      .toPromise()
  }

  getEventsToday(page:number){
    let lat = this.locationService.getLat();
    let lng = this.locationService.getLng();
    let dist = this.locationService.getDistMeters();
    let tz = this.locationService.getTimezone();
    return this.httpHandlerService.get(`event/today?lat=${lat}&lng=${lng}&dist=${dist}&tz=${tz}`)
      .map(response => response.json().data)
      .toPromise()
  }

  getEventFull(id:number){
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
      .map(response => response.json().data)
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

  confirmEvent(id):Promise<any>{
    return this.httpHandlerService.get(`event/${id}/confirm`)
      .map(response => response.json().data)
      .toPromise();
  }

  getVenueTimezone(lat,lng,timestamp){
    //TODO: change this to the locationService.getTimezone
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