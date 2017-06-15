import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { Venue } from '../_models/venue';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class VenueService {
  constructor(
    private httpHandlerService: HttpHandlerService
  ){}

  getVenues(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`venue?page=${page}&pp=${perpage}`)
      .toPromise();
  }
  
  getVenue(id:number){
    return this.httpHandlerService.get(`venue/${id}`)
      .toPromise();
  }

  createVenue(venue:Venue):Promise<any>{
    let options = {
      name: venue.name,
      description: venue.description,
      public: venue.public
    }
    return this.httpHandlerService.post('venue', options)
      .toPromise();
  }
}