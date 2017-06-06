import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { HttpHandlerService } from './http-handler.service';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class SearchService {
  constructor(
    private http: Http,
    private router:Router,
    private httpHandlerService: HttpHandlerService
  ){}

  search(term: string): Observable<Hero[]> {
    return httpHandlerService
      .get(`events/?q=${term}`)
      .map(response => response.json().data.data);
  }
}