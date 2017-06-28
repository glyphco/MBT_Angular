import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class CategoryService {
  constructor(
    private httpHandlerService: HttpHandlerService
  ){}

  getCategories():Promise<any>{
    return this.httpHandlerService.get('category')
      .toPromise()
  }

}