import { Component, OnInit } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'follower-requests',
  template: `
    <ul>
      <li *ngFor="let user of users">{{user.name}}</li>
    </ul>
  `,
  styleUrls: ['./followers-list.component.css']
})
export class FollowerRequestsComponent implements OnInit {
  users:User[] = [];

  constructor(private meService:MeService){}

  ngOnInit(){
    this.getFollowRequests();
  }

  private getFollowRequests(){
    this.meService.getFollowRequests().then(users => {
      this.users = User.arrayMap(users.data);
    }).catch(error => console.log(error));
  }
}
