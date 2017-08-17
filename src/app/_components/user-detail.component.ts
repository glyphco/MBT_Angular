import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MeService } from '../_services/me.service';
import { HttpHandlerService } from '../_services/http-handler.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  //styleUrls: ['./events-editable.component.css']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  role = 'nothing';
  message;
  private sub:any;

  constructor(
    private meService: MeService, 
    private httpHandlerService:HttpHandlerService,
    private route: ActivatedRoute,
    private router: Router){}

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       //MARK: This is where we would get the user
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  saveRole(){
    this.httpHandlerService.get(`me/makeme/${this.role}`)
      .map(response => response.json())
      .toPromise()
      .then(response => this.message = response.data )
      .catch(error => this.message = 'Role change failed')
  }
}
