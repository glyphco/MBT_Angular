import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoundationModule } from '../_modules/foundation.module';
import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from '../_components/login.component';

import { SocialLoginService } from '../_services/social-login.service';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    FoundationModule,
    CommonModule,
    LoginRoutingModule,
  ],
  providers: [
    SocialLoginService
  ]
})
export class LoginModule { }
