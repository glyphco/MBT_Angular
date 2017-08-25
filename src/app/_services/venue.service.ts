import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { LocationService } from './location.service';
import { Venue } from '../_models/venue';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class VenueService {
  constructor(
    private httpHandlerService: HttpHandlerService,
    private locationService: LocationService
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

  //custom call for venue view page
  getVenueDetails(id:number){
      let lat = this.locationService.getLat();
    let lng = this.locationService.getLng();
    return this.httpHandlerService.get(`venue/${id}/details?lat=${lat}&lng=${lng}`)
      .map(response => response.json().data)
      .toPromise()
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
      slug: venue.slug,
    }
    return this.httpHandlerService.post('venue', params)
      .map(response => response.json())
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
      imageurl: venue.imageUrl,
      slug: venue.slug
    }
    return this.httpHandlerService.put(`venue/${venue.id}`, params)
      .toPromise();
  }
}