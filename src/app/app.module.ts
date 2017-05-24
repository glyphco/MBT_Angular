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
    AuthService,
    AuthGuard,
    PublicGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
