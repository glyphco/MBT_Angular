import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class ShowService {
  constructor(
    private httpHandlerService: HttpHandlerService
  ){}

  getShows(page=1, perpage=10):Promise<any>{
    return this.httpHandlerService.get(`showpage?page=${page}&pp=${perpage}`)
      .toPromise();
  }

  getShow(id:number){
    return this.httpHandlerService.get(`showpage/${id}`)
      .toPromise();
  }
}