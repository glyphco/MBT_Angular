import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { Show } from '../_models/show';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class ShowService {
  constructor(
    private httpHandlerService: HttpHandlerService
  ){}

  getShows(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`show?page=${page}&pp=${perpage}`)
      .toPromise();
  }

  getShowsEditable(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`show/editable?page=${page}&pp=${perpage}`)
      .toPromise();
  }

  getShow(id:number){
    return this.httpHandlerService.get(`show/${id}`)
      .toPromise();
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
      summary: show.summary,
      tagline: show.tagline,
      slug: show.slug,
      confirmed: show.confirmed,
      public: show.public,
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

  createShow(show:Show,categories):Promise<any>{
    let options = {
      name: show.name,
      description: show.description,
      summary: show.summary,
      tagline: show.tagline,
      slug: show.slug,
      confirmed: show.confirmed,
      public: show.public,
      categories: categories.length > 0 ? JSON.stringify(categories) : undefined
    }
    return this.httpHandlerService.post('show', options)
      .toPromise();
  }

  getCategories(){
    return this.httpHandlerService.get('pagecategory')
      .toPromise();
  }
}