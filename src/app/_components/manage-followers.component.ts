import { Component, OnInit } from '@angular/core';
import { MeService } from '../_services/me.service';


@Component({
  selector: 'app-manage-followers',
  templateUrl: './manage-followers.component.html',
  styleUrls: ['./manage-followers.component.css']
})
export class ManageFollowersComponent implements OnInit {

  constructor(
    private meService: MeService
  ){}

  ngOnInit(){
    //this.meService.getFollo
  }
}
