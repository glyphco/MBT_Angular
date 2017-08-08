import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { Venue } from '../_models/venue';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class VenueService {
  constructor(
    private httpHandlerService: HttpHandlerService
  ){}

  getVenuesEditable(page=1, perpage=10, options):Promise<any>{
    let query = this.httpHandlerService.serialize(options);
    return this.httpHandlerService.get(`venue/editable?page=${page}&pp=${perpage}&${query}`)
      .toPromise();
  }
  
  getVenue(id:number){
    return this.httpHandlerService.get(`venue/${id}`)
      .toPromise();
  }

  getVenueEdit(id:number){
    return this.httpHandlerService.get(`venue/${id}/edit`)
      .map(response => Venue.map(response.json().data))
      .toPromise();
  }

  createVenue(venue:Venue):Promise<any>{
    let params = {
      name: venue.name,
      description: venue.description,
      public: venue.public,
      confirmed: venue.confirmed,
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
      slug: venue.slug,
      tagline: venue.tagline
    }
    return this.httpHandlerService.post('venue', params)
      .toPromise();
  }

  confirmVenue(id):Promise<any>{
    return this.httpHandlerService.get(`venue/${id}/confirm`)
      .map(response => response.json().data)
      .toPromise();
  }

  deleteVenue(id):Promise<any>{
    return this.httpHandlerService.delete(`venue/${id}`)
      .toPromise();
  }

  updateVenue(venue:Venue):Promise<any>{
    let params = {
      name: venue.name,
      description: venue.description,
      public: venue.public,
      confirmed: venue.confirmed,
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
      slug: venue.slug,
      tagline: venue.tagline
    }
    return this.httpHandlerService.put(`venue/${venue.id}`, params)
      .toPromise();
  }
}