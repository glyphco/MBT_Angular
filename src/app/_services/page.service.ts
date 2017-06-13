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

  getPage(id:number):Promise<any>{
    return this.httpHandlerService.get(`page/${id}`)
      .toPromise();
  }
  
  updatePage(page:Page):Promise<any>{
    let id = page.id;
    let options = {
      //TODO: could put all the trimming into the http service as a function
      //can't trim numbers though (i think)
      name: page.name,
      state: page.state,
      city: page.city,
      postalcode: page.postalcode
    }
    return this.httpHandlerService.put(`page/${id}`, options)
      .toPromise();
  }

  getCategories(){
    return this.httpHandlerService.get('pagecategory')
      .toPromise();
  }
}