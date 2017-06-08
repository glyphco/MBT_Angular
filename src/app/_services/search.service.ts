import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { HttpHandlerService } from './http-handler.service';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class SearchService {
  constructor(
    private http: Http,
    private router:Router,
    private httpHandlerService: HttpHandlerService
  ){}
  
  search(term: string): Observable<any> {
    return this.httpHandlerService
    //TODO: this will be a global search one day
      .get(`venue?q=${term}`)
      .map(response => response.json().data.data);
  }
}