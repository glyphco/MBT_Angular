import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { SocialLoginService } from '../_services/social-login.service';
import { MeService } from '../_services/me.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  constructor(
    private authService: AuthService,
    private socialLoginService: SocialLoginService,
    private meService: MeService,
    private router:Router
  ){}

  //Initialize auth providers
  ngAfterViewInit() {
    this.socialLoginService.initProviders();
  }

  facebookLogin(){
    this.socialLoginService.facebookLogin().then(response => {
      //initialize user
      return this.meService.initializeMe();
    }).then(response => {
      //redirect user
      this.router.navigate(['/events/today']);
    }).catch(error => console.log('Something went wrong when getting JWT token from API or user closed Facebook popup'));
  }

  googleLogin(){
    this.socialLoginService.googleLogin().then(response => {
      //initialize user
      return this.meService.initializeMe();
    }).then(response => {
      //redirect user
      this.router.navigate(['/events/today']);
    }).catch(error => console.log('Something went wrong when getting JWT token from API or user closed Google popup'));
  }
}
