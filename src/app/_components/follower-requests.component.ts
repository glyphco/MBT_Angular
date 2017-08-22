import { Component, OnInit } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'follower-requests',
  template: `
    <div class="list-header">
      <h3>Follow requests</h3>
    </div>
    <ul class="user-list-container">
      <li *ngFor="let user of users" class="user-container">
        <img src="{{user.avatar}}" /> <span>{{user.name}}</span>

        <ng-container [ngSwitch]="user.userSeesYou">
          <ng-container *ngSwitchCase="2">
            <button class="btn btn-danger" (click)="declineFollower(user)">Decline request</button>
            <button class="btn btn-primary mrgn-right" (click)="acceptFollower(user)">Accept request</button>
          </ng-container>
          <ng-container *ngSwitchCase="3">
            <button class="btn btn-primary" *ngIf="user.youSeeUser == 1" (click)="requestUser(user)">Follow</button>
            <button class="btn btn-warning" *ngIf="user.youSeeUser == 2" (click)="unrequestUser(user)">Unrequest</button>
            <button class="btn btn-danger" *ngIf="user.youSeeUser == 3" (click)="unfollowUser(user)">Unfollow</button>
          </ng-container>   
        </ng-container>
      </li>
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
      this.users = User.arrayMap(users.data.data);
    }).catch(error => console.log(error));
  }

  public declineFollower(user:User){
    this.meService.declineRequest(user.id).then(response => {
      this.removeUserFromList(user);
    }).catch(error => {
      console.log(error);
    });
  }

  public acceptFollower(user:User){
    this.meService.acceptRequest(user.id).then(response => {
      user.userSeesYou = 3;
      user.youSeeUser = +response.data.youseeuser;
      //TODO: add user.youSeeUser here
    }).catch(error => {
      console.log(error);
    });
  }

  public requestUser(user:User){
    this.meService.requestUser(user.id).then(response => {
      user.youSeeUser = 3;
    }).catch(error => {
      console.log(error);
    });
  }

  public unrequestUser(user:User){
    this.meService.unrequestUser(user.id).then(response => {
      user.youSeeUser = 1;
    }).catch(error => {
      console.log(error);
    });
  }

  public unfollowUser(user:User){
    this.meService.unfollowUser(user.id).then(response => {
      user.youSeeUser = 1;
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
