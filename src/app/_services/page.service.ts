import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { HttpHandlerService } from './http-handler.service';
import { Page } from '../_models/page';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class PageService {
  constructor(
    private http: Http,
    private router:Router,
    private httpHandlerService: HttpHandlerService
  ){}

  getPages(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`page?page=${page}&pp=${perpage}`)
      .toPromise();
  }

  getPagesEditable(page=1, perpage=100, options):Promise<any>{
    let query = this.httpHandlerService.serialize(options);
    return this.httpHandlerService.get(`page/editable?page=${page}&pp=${perpage}&${query}`)
      .toPromise();
  }

  getPage(id:number):Promise<any>{
    return this.httpHandlerService.get(`page/${id}`)
      .toPromise();
  }

  getPageEdit(id:number):Promise<any>{
    return this.httpHandlerService.get(`page/${id}/edit`)
      .toPromise();
  }
  
  updatePage(page:Page, categories):Promise<any>{
    let id = page.id;
    let options = {
      name: page.name,
      description: page.description,
      public: page.public,
      confirmed: page.confirmed,
      city: page.city,
      state: page.state,
      postalcode: page.postalcode,
      participant: page.participant,
      production: page.production,
      slug: page.slug,
      phone: page.phone,
      email: page.email,
      tagline: page.tagline,
      summary: page.summary,
      categories: JSON.stringify(categories)
    }
    return this.httpHandlerService.put(`page/${id}`, options)
      .toPromise();
  }

  deletePage(id):Promise<any>{
    return this.httpHandlerService.delete(`page/${id}`)
      .toPromise();
  }

  confirmPage(id):Promise<any>{
    return this.httpHandlerService.get(`page/${id}/confirm`)
      .map(response => response.json().data)
      .toPromise();
  }

  getCategories(){
    return this.httpHandlerService.get('pagecategory')
      .toPromise();
  }

  createPage(page:Page, categories):Promise<any>{
    let options = {
      name: page.name,
      description: page.description,
      public: page.public,
      confirmed: page.confirmed,
      city: page.city,
      state: page.state,
      postalcode: page.postalcode,
      participant: page.participant,
      production: page.production,
      slug: page.slug,
      phone: page.phone,
      email: page.email,
      tagline: page.tagline,
      summary: page.summary,
      categories: categories.length > 0 ? JSON.stringify(categories) : undefined
    }
    return this.httpHandlerService.post('page', options)
      .toPromise();
  }
}