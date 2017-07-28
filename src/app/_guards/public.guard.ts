import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class PublicGuard implements CanActivate {
 
    constructor(
      private router: Router,
      private authService: AuthService
    ) { }
 
    canActivate() {
        if(this.authService.isLoggedIn()){
          //logged in so redirect to backstage
          this.router.navigate(['/backstage']);
          return false;
        }
        return true;
    }
}