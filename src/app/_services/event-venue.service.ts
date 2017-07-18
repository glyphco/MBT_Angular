import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { LocationService } from './location.service';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class EventVenueService {
  constructor(
    private httpHandlerService: HttpHandlerService,
    private locationService: LocationService
  ){}

  getEventVenues(page=1, perpage=10):Promise<any>{
    //get location info
    let lat = this.locationService.getLat();
    let lng = this.locationService.getLng();
    let options = lat && lng ? `&lat=${lat}&lng=${lng}&dist=20` : '';
    return this.httpHandlerService.get(`public/events?page=${page}&pp=${perpage}${options}`)
      .toPromise()
  }

}