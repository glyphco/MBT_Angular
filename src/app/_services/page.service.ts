import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { HttpHandlerService } from './http-handler.service';
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
  
}