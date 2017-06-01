import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './_guards/auth.guard';
import { PublicGuard } from './_guards/public.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './_components/login.component';
import { DashboardComponent } from './_components/dashboard.component';

import { AuthService } from './_services/auth.service';
import { VenueService } from './_services/venue.service';
import { HttpHandlerService } from './_services/http-handler.service';
import { JwtHelperService } from './_services/jwt-helper.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    PublicGuard,
    AuthService,
    VenueService,
    HttpHandlerService,
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
