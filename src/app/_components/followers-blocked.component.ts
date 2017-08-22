import { Component, OnInit } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'followers-blocked',
  template: `
    <div class="list-header">
      <h3>Blocked users</h3>
    </div>
    <ul class="user-list-container">
      <li *ngFor="let user of users" class="user-container">
        <img src="{{user.avatar}}" /> <span>{{user.name}}</span>

        <div class="buttons-container">
          <button class="btn btn-primary" (click)="unblockUser(user)">Unblock</button>
        </div>
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
    this.meService.unblockUser(user.id).then(response => {
      this.removeUserFromList(user);
    }).catch(error => {
      console.log(error);
    });
  }

  private removeUserFromList(user:User){
    let index = this.users.indexOf(user);
    if(index !== -1){
      //element exists in our array
      this.users.splice(index, 1);
    }
  }
}
