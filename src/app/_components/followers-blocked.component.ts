import { Component, OnInit } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'followers-blocked',
  template: `
    <h3>Blocked users</h3>
    <ul class="user-list-container">
      <li *ngFor="let user of users" class="user-container">
        <img src="{{user.avatar}}" /> <span>{{user.name}}</span>

        <button (click)="unblockUser(user)">Unblock</button>
      </li>
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
      this.users = User.arrayMap(users.data.data);
    }).catch(error => console.log(error));
  }

  public unblockUser(user:User){
    this.removeUserFromList(user);
  }

  private removeUserFromList(user:User){
    let index = this.users.indexOf(user);
    console.log(index);
    if(index !== -1){
      //element exists in our array
      this.users.splice(index, 1);
    }
  }
}
