import { Component, OnInit } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'followers',
  template: `
    <div class="list-header">
      <h3>Followers</h3>
    </div>
    <ul class="user-list-container">
      <li *ngFor="let user of users" class="user-container">
        <img src="{{user.avatar}}" /> <span>{{user.name}}</span>
        
        <button class="btn btn-danger" (click)="confirmDismissFollower(user)">Dismiss</button>
      </li>
    </ul>

    <modal [(modalVisible)]="modalVisible">
      <div class="modal-title">
        <h3><span>Wait.</span><b> Are you sure you want to dismiss {{selectedUser.name}}? This will make them unfollow you.</b></h3>
      </div>
      <div class="modal-body" style="padding:20px;">
        <button class="btn-fluid danger" (click)="dismissFollower(selectedUser)" style="margin-bottom:5px;">Dismiss</button>
        <button class="btn-fluid default" (click)="modalVisible = false">Cancel</button>
      </div>
    </modal>
  `,
  styleUrls: ['./followers-list.component.css']
})
export class FollowersComponent implements OnInit {
  users:User[] = [];
  modalVisible = false;
  selectedUser = new User();

  constructor(private meService:MeService){}

  ngOnInit(){
    this.getFollowers();
  }

  private getFollowers(){
    this.meService.getFollowers().then(users => {
      this.users = User.arrayMap(users.data.data);
    }).catch(error => console.log(error));
  }

  public confirmDismissFollower(user:User){
    this.selectedUser = user;
    this.modalVisible = true;
  }

  public dismissFollower(user:User){
    this.meService.dismissFollower(user.id).then(response => {
      this.removeUserFromList(user);
      this.closeModal();
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

  private closeModal(){
    this.modalVisible = false;
  }
}
