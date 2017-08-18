import { Component } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'app-manage-followers',
  templateUrl: './manage-followers.component.html',
  styleUrls: ['./manage-followers.component.css']
})
export class ManageFollowersComponent {
  users:User[];
  /*
    0 requests
    1 followers
    3 following
    4 blocked
  */
  currentMode = 0;

  constructor(){}

  public changeMode(mode:number):void {
    this.currentMode = mode;
  }
}
