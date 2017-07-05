import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class EventVenueService {
  constructor(
    private httpHandlerService: HttpHandlerService
  ){}

  getEventVenues(page=1, perpage=10):Promise<any>{
    //get location info
    let options = '';
    let locationType = localStorage.getItem('selectedLocationType');
    if(locationType == 'current'){
      //TODO: remove this debug code
      let lat = localStorage.getItem('lat');
      let lng = localStorage.getItem('lng');
      let radius = '10';
      options = `lat=${lat}&lng=${lng}&dist=${radius}`;
    }else if(locationType == 'custom'){
      let lat = localStorage.getItem('sel_lat');
      let lng = localStorage.getItem('sel_lng');
      let radius = '50';
      options = `lat=${lat}&lng=${lng}&dist=${radius}`;
    }
    return this.httpHandlerService.get(`public/eventvenues?${options}&page=${page}&pp=${perpage}`)
      .toPromise()
  }

}