import { Component } from '@angular/core';
import { MeService } from '../_services/me.service';
import { HttpHandlerService } from '../_services/http-handler.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  //styleUrls: ['./events-editable.component.css']
})
export class ProfileComponent {
  role = 'nothing';

  constructor(private meService: MeService, private httpHandlerService:HttpHandlerService){}

  saveRole(){
    this.httpHandlerService.get(`me/makeme/${this.role}`)
      .toPromise()
      .then(response => console.log('Role changed'))
      .catch(error => console.log('Can not change role'))
  }
}
