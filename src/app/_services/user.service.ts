import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class UserService {
  constructor(
    private httpHandlerService: HttpHandlerService
  ){}

  getUsersEditable(page=1, perpage=10, options):Promise<any>{
    let query = this.httpHandlerService.serialize(options);
    return this.httpHandlerService.get(`user/editable?page=${page}&pp=${perpage}&${query}`)
      .map(response => response.json().data)
      .toPromise();
  }

  getUser(id:number):Promise<any>{
    return this.httpHandlerService.get(`user/${id}/details`)
      .map(response => response.json().data)
      .toPromise();
  }
}