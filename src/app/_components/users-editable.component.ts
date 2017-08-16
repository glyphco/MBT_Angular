import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { UserService } from '../_services/user.service';
import { Pagination } from '../_helpers/pagination';
import { MeService } from '../_services/me.service';

@Component({
  selector: 'app-users-editable',
  templateUrl: './users-editable.component.html',
  styleUrls: ['./events-editable.component.css']
})
export class UsersEditableComponent implements OnInit {
  pagination = new Pagination();
  users:any;
  orderBy = "name";
  publicPrivate;
  confirmedUnconfirmed;

  constructor(private userService:UserService, private router:Router, private meService: MeService){}

  ngOnInit():void{
    this.getUsersEditable(1)
  }

  private getOptions(){
    let options = <any>{};
    options.sortby = this.orderBy;
    if(this.publicPrivate == "public"){
      options.public = 1;
    }else if(this.publicPrivate == "private"){
      options.private = 1;
    }

    if(this.confirmedUnconfirmed == "confirmed"){
      options.confirmed = 1
    }else if(this.confirmedUnconfirmed == "unconfirmed"){
      options.unconfirmed = 1;
    }
    return options;
  }

  public getUsersEditable(page:number){
    let options = this.getOptions();
    this.userService.getUsersEditable(page, 100, options).then(users => {
      this.users = users.data;
      let perPage = users.per_page;
      let totalObjects = users.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
   /*
  public confirmPage(page){
    this.userService.confirmPage(page.id).then(response => {
      page.confirmed = 1;
    }).catch(error => console.log(error));
  }*/

  public setOrderBy(value){
    this.orderBy = value;
    this.getUsersEditable(1);
  }
  public setPublic(value){
    this.publicPrivate = value;
    this.getUsersEditable(1);
  }
  public setConfirmed(value){
    this.confirmedUnconfirmed = value;
    this.getUsersEditable(1);
  }
}
