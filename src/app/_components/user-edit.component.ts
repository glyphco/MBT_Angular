import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { MeService } from '../_services/me.service';
import { DateTime } from '../_helpers/date-time.service';
import { StatesHelper } from '../_helpers/states-helper';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  //styles: ['./page-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {
  user = new User;
  private sub: any;
  bannedUntil = new DateTime();
  states = StatesHelper.states;

  constructor(
    private userService:UserService,
    private route: ActivatedRoute,
    private location: Location,
    private meService: MeService,
    private router: Router
  ){}

  ngOnInit():void{
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getUserEdit(id);
    });
    console.log(this.bannedUntil.date);
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  public getUserEdit(id:number){
    this.userService.getUserEdit(id).then(user => {
      this.user = User.map(user.json().data);
    }).catch(error => console.log(error));
  }

  public onSubmit(){
    console.log(this.user);
    this.userService.updateUser(this.user).then(response => {
      this.router.navigate(['/users/editable']);
    }).catch(error => console.log(error));
  }
}
