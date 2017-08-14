import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  //styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  constructor(
    private authService: AuthService
  ){}

  //Initialize auth providers
  ngAfterViewInit() {
    this.authService.initProviders('googleBtn');
  }

  facebookLogin(){
    this.authService.facebookLogin();
  }

  loginWithGoogle(){
    this.authService.loginWithGoogle();
  }
}
