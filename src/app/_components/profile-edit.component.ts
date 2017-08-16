import { Component } from '@angular/core';
import { MeService } from '../_services/me.service';
import { HttpHandlerService } from '../_services/http-handler.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  //styleUrls: ['./events-editable.component.css']
})
export class ProfileEditComponent {
  role = 'nothing';

  constructor(private meService: MeService, private httpHandlerService:HttpHandlerService){}
}
