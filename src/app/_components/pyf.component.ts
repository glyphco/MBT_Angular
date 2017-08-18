import { Component, OnInit } from '@angular/core';
import { MeService } from '../_services/me.service';
import { User } from '../_models/user';


@Component({
  selector: 'pyf',
  template: `
    <ul>
      <li *ngFor="let user of users">{{user.name}}</li>
    </ul>
  `,
  styleUrls: ['./followers-list.component.css']
})
export class PyfComponent implements OnInit {
  users:User[] = [];

  constructor(private meService:MeService){}

  ngOnInit(){
    this.getPyfs();
  }

  private getPyfs(){
    this.meService.getPyfs().then(users => {
      this.users = User.arrayMap(users.data);
    }).catch(error => console.log(error));
  }
}
