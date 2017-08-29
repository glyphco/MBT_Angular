import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { LocationService } from './location.service';
import { Show } from '../_models/show';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class ShowService {
  constructor(
    private httpHandlerService: HttpHandlerService,
    private locationService: LocationService
  ){}

  getShows(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`show?page=${page}&pp=${perpage}`)
      .toPromise();
  }

  getShowsEditable(page=1, perpage=10, options):Promise<any>{
    let query = this.httpHandlerService.serialize(options);
    return this.httpHandlerService.get(`show/editable?page=${page}&pp=${perpage}&${query}`)
      .toPromise();
  }

  getShow(id:number){
    return this.httpHandlerService.get(`show/${id}`)
      .toPromise();
  }

  //custom call for show view page
  getShowDetails(id:number){
    let lat = this.locationService.getLat();
    let lng = this.locationService.getLng();
    return this.httpHandlerService.get(`show/${id}/details?lat=${lat}&lng=${lng}`)
      .map(response => response.json().data)
      .toPromise()
  }

  getShowEdit(id:number){
    return this.httpHandlerService.get(`show/${id}/edit`)
      .toPromise();
  }

  updateShow(show:Show, categories):Promise<any>{
    let id = show.id;
    let options = {
      name: show.name,
      description: show.description,
      tagline: show.tagline,
      slug: show.slug,
      confirmed: show.confirmed,
      public: show.public,
      imageurl: show.imageUrl,
      categories: JSON.stringify(categories)
    }
    return this.httpHandlerService.put(`show/${id}`, options)
      .toPromise();
  }

  deleteShow(id):Promise<any>{
    return this.httpHandlerService.delete(`show/${id}`)
      .toPromise();
  }

  confirmShow(id):Promise<any>{
    return this.httpHandlerService.get(`show/${id}/confirm`)
      .map(response => response.json().data)
      .toPromise();
  }

  likeShow(id):Promise<any>{
    return this.httpHandlerService.get(`show/${id}/like`)
      .map(response => response.json())
      .toPromise();
  }

  createShow(show:Show,categories):Promise<any>{
    let options = {
      name: show.name,
      description: show.description,
      tagline: show.tagline,
      slug: show.slug,
      confirmed: show.confirmed,
      public: show.public,
      categories: categories.length > 0 ? JSON.stringify(categories) : undefined
    }
    return this.httpHandlerService.post('show', options)
      .map(response => response.json())
      .toPromise();
  }

  getCategories(){
    return this.httpHandlerService.get('pagecategory')
      .toPromise();
  }
}