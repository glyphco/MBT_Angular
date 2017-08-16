import { Component } from '@angular/core';
import { MeService } from '../_services/me.service';
import { HttpHandlerService } from '../_services/http-handler.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  //styleUrls: ['./events-editable.component.css']
})
export class UserDetailComponent {
  role = 'nothing';
  message;

  constructor(private meService: MeService, private httpHandlerService:HttpHandlerService){}

  saveRole(){
    this.httpHandlerService.get(`me/makeme/${this.role}`)
      .map(response => response.json())
      .toPromise()
      .then(response => this.message = response.data )
      .catch(error => this.message = 'Role change failed')
  }
}
