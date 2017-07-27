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
    return this.httpHandlerService.get(`venue?page=${page}&pp=${perpage}&ConfirmedAndUnconfirmed&PublicAndPrivate`)
      .toPromise();
  }
  
  getVenue(id:number){
    return this.httpHandlerService.get(`venue/${id}`)
      .toPromise();
  }

  createVenue(venue:Venue):Promise<any>{
    let params = {
      name: venue.name,
      description: venue.description,
      public: venue.public,
      street_address: venue.streetAddress,
      city: venue.city,
      state: venue.state,
      lat: venue.lat,
      lng: venue.lng,
      local_tz: venue.localTz,
      google_place_id: venue.googlePlaceId,
      postalcode: venue.postalCode,
      neighborhood: venue.neighborhood,
      website: venue.website,
      phone: venue.phone,
      email: venue.email,
      category: venue.category,
      slug: venue.slug,
      tagline: venue.tagline
    }
    return this.httpHandlerService.post('venue', params)
      .toPromise();
  }
}