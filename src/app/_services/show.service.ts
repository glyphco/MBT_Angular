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

  getShow(id:number){
    return this.httpHandlerService.get(`show/${id}`)
      .toPromise();
  }

  updateShow(show:Show):Promise<any>{
    let id = show.id;
    let options = {
      //TODO: could put all the trimming into the http service as a function
      //can't trim numbers though (i think)
      name: show.name
    }
    return this.httpHandlerService.put(`show/${id}`, options)
      .toPromise();
  }

  createShow(show:Show):Promise<any>{
    let options = {
      name: show.name,
      description: show.description,
      public: show.public
    }
    return this.httpHandlerService.post('show', options)
      .toPromise();
  }

  getCategories(){
    return this.httpHandlerService.get('pagecategory')
      .toPromise();
  }
}