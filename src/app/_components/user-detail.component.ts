import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MeService } from '../_services/me.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { HttpHandlerService } from '../_services/http-handler.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./lists.component.css']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  role = 'nothing';
  user:User;
  private userId:number;
  get isOwner() {
    if(this.meService.id == this.userId){
      return true;
    }
    return false;
  }
  message;
  private sub:any;

  constructor(
    private meService: MeService, 
    private userService: UserService, 
    private httpHandlerService:HttpHandlerService,
    private route: ActivatedRoute,
    private router: Router){}

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
       this.userId = +params['id']; // (+) converts string 'id' to a number
       //MARK: This is where we would get the user
       this.getUser();
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  private getUser(){
    let id = this.userId;
    this.userService.getUser(id).then(user => {
      console.log(user);
      this.user = User.map(user);
      console.log(this.user);
    }).catch(error => console.log(error));
  }

  saveRole(){
    this.httpHandlerService.get(`me/makeme/${this.role}`)
      .map(response => response.json())
      .toPromise()
      .then(response => this.message = response.data )
      .catch(error => this.message = 'Role change failed')
  }
}
