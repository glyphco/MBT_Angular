import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
/*
declare var gapi: any;
declare var fbAsyncInit:any;
declare var window:any;
declare var FB:any;
*/
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  //styleUrls: ['./login.component.css']
})
export class DashboardComponent {

  constructor(
    private authService: AuthService
  ){}
}
