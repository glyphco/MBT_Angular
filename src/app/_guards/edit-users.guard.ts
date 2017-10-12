import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { MeService } from '../_services/me.service';

@Injectable()
export class EditUsersGuard implements CanActivate {
 
    constructor(
      private router: Router,
      private meService: MeService
    ) { }
 
    canActivate() {
        if(this.meService.hasUserEdit()){
          return true;
        }else{
          // not logged in so redirect to login page
          this.router.navigate(['/login']);
          return false;
        }
    }
}