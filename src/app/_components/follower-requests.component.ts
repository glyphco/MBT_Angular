import { Component, OnInit } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'follower-requests',
  template: `
    <h3>Follow requests</h3>
    <ul class="user-list-container">
      <li *ngFor="let user of users" class="user-container">
        <img src="{{user.avatar}}" /> <span>{{user.name}}</span>
        

        <ng-template #followBlock>
          
        </ng-template>

        <ng-container [ngSwitch]="user.userSeesYou">
          <ng-container *ngSwitchCase="2">
            <button (click)="declineFollower(user)">Decline request</button>
            <button (click)="acceptFollower(user)">Accept request</button>
          </ng-container>
          <ng-container *ngSwitchCase="3">
            <button *ngIf="user.youSeeUser == 1" (click)="followUser(user)">Follow</button>
            <button *ngIf="user.youSeeUser == 2" (click)="unrequestUser(user)">Unrequest</button>
            <button *ngIf="user.youSeeUser == 3" (click)="unfollowUser(user)">Unfollow</button>
          </ng-container>   
        </ng-container>
      </li>
    </ul>

    <modal [(modalVisible)]="modalVisible">
      <div class="modal-title">
        <h3><span>Wait.</span><b> Are you sure you want to dismiss {{selectedUser.name}}? This will make them unfollow you.</b></h3>
      </div>
      <div class="modal-body">
        <button class="btn default" (click)="dismissFollower(selectedUser)" style="margin-bottom:5px;">Dismiss</button>
        <button class="btn danger" (click)="modalVisible = false">Cancel</button>
      </div>
    </modal>
  `,
  styleUrls: ['./followers-list.component.css']
})
export class FollowerRequestsComponent implements OnInit {
  users:User[] = [];
  modalVisible = false;
  selectedUser = new User();
  
  constructor(private meService:MeService){}

  ngOnInit(){
    this.getFollowRequests();
  }

  private getFollowRequests(){
    this.meService.getFollowRequests().then(users => {
      this.users = User.arrayMap(users.data.data);
      this.users[0].youSeeUser = 1; //TODO: REMOVE THIS!!!
    }).catch(error => console.log(error));
  }

  public confirmDismissFollower(user:User){
    this.selectedUser = user;
    this.modalVisible = true;
  }

  public declineFollower(user:User){
    this.removeUserFromList(user);
    /*
    this.meService.declineRequest(user.id).then(response => {
      user.userSeesYou = 1;
    }).catch(error => {
      console.log(error);
    });*/
  }

  public acceptFollower(user:User){
    user.userSeesYou = 3;
    /*
    this.meService.acceptRequest(user.id).then(response => {
      user.userSeesYou = 3;
    }).catch(error => {
      console.log(error);
    });*/
  }

  public followUser(user:User){
    user.youSeeUser = 3;
    /*
    this.meService.followUser(user.id).then(response => {
      user.userSeesYou = 1;
    }).catch(error => {
      console.log(error);
    });*/
  }

  public unfollowUser(user:User){
    user.youSeeUser = 1;
    /*
    this.meService.followUser(user.id).then(response => {
      user.userSeesYou = 1;
    }).catch(error => {
      console.log(error);
    });*/
  }

  private removeUserFromList(user:User){
    let index = this.users.indexOf(user);
    console.log(index);
    if(index !== -1){
      //element exists in our array
      this.users.splice(index, 1);
    }
  }

  private closeModal(){
    this.modalVisible = false;
  }
}
