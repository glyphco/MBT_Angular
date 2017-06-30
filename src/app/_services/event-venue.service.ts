import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class EventVenueService {
  constructor(
    private httpHandlerService: HttpHandlerService
  ){}

  getEventVenues(page=1, perpage=10):Promise<any>{
    //let lat = 
    return this.httpHandlerService.get(`public/eventvenues?page=${page}&pp=${perpage}`)
      .toPromise()
  }

}