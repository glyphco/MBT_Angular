import { Component, OnInit } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'followers-blocked',
  template: `
    <ul>
      <li *ngFor="let user of users">{{user.name}}</li>
    </ul>
  `,
  styleUrls: ['./followers-list.component.css']
})
export class FollowersBlockedComponent implements OnInit {
  users:User[] = [];

  constructor(private meService:MeService){}

  ngOnInit(){
    this.getFollowersBlocked();
  }

  private getFollowersBlocked(){
    this.meService.getFollowersBlocked().then(users => {
      this.users = User.arrayMap(users.data);
    }).catch(error => console.log(error));
  }
}
