import { Component, OnInit, Inject } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'pyf',
  template: `
    <div class="list-header">
      <h3>People you follow</h3>
    </div>
    <ul class="user-list-container">
      <li *ngFor="let user of users" class="user-container">
        <img src="{{user.avatar}}" /> <span>{{user.name}}</span>

        <div class="buttons-container">
          <ng-container [ngSwitch]="user.youSeeUser">
            <ng-container *ngSwitchCase="3">
              <button class="btn btn-danger" (click)="confirmUnfollowUser(user)">Unfollow</button>
            </ng-container>
            <ng-container *ngSwitchCase="2">
              <button class="btn btn-warning" (click)="unrequestUser(user)">Unrequest</button>
            </ng-container>
            <ng-container *ngSwitchCase="1">
              <button class="btn btn-primary" (click)="requestUser(user)">Follow</button>
            </ng-container>     
          </ng-container>
        </div>
      </li>
    </ul>

    <modal [(modalVisible)]="modalVisible">
      <div class="modal-title">
        <h3><span>Wait.</span><b> Are you sure you want to unfollow {{selectedUser.name}}?</b></h3>
      </div>
      <div class="modal-body" style="padding:20px;">
        <button class="btn-fluid danger" (click)="unfollowUser(selectedUser)" style="margin-bottom:5px;">Unfollow</button>
        <button class="btn-fluid default" (click)="modalVisible = false">Cancel</button>
      </div>
    </modal>
  `,
  styleUrls: ['./followers-list.component.css']
})
export class PyfComponent implements OnInit {
  users:User[] = [];
  modalVisible = false;
  selectedUser = new User();

  constructor(private meService:MeService){}

  ngOnInit(){
    this.getPyfs();
  }

  private getPyfs(){
    this.meService.getPyfs().then(users => {
      this.users = User.arrayMap(users.data.data);
      console.log(users);
    }).catch(error => console.log(error));
  }

  public confirmUnfollowUser(user:User){
    this.selectedUser = user;
    this.modalVisible = true;
  }

  public unfollowUser(user:User){
    this.meService.unfollowUser(user.id).then(response => {
      this.closeModal();
      user.youSeeUser = 1;
    }).catch(error => {
      console.log(error);
      this.closeModal();
    });
  }

  public requestUser(user:User){
    this.meService.requestUser(user.id).then(response => {
      user.youSeeUser = response.data.youseeuser;
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

  private closeModal(){
    this.modalVisible = false;
  }
}
