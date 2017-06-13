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
import { EventsComponent } from './_components/events.component';
import { VenuesComponent } from './_components/venues.component';
import { ShowsComponent } from './_components/shows.component';
import { SearchComponent } from './_components/search.component';
import { PagesComponent } from './_components/pages.component';
import { PageDetailComponent } from './_components/page-detail.component';
import { EventDetailComponent } from './_components/event-detail.component';
import { VenueDetailComponent } from './_components/venue-detail.component';
import { ShowDetailComponent } from './_components/show-detail.component';
import { PageEditComponent } from './_components/page-edit.component';
import { EventEditComponent } from './_components/event-edit.component';

import { AuthService } from './_services/auth.service';
import { VenueService } from './_services/venue.service';
import { EventService } from './_services/event.service';
import { SearchService } from './_services/search.service';
import { HttpHandlerService } from './_services/http-handler.service';
import { JwtHelperService } from './_services/jwt-helper.service';
import { PageService } from './_services/page.service';
import { ShowService } from './_services/show.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EventsComponent,
    VenuesComponent,
    ShowsComponent,
    SearchComponent,
    PagesComponent,
    PageDetailComponent,
    EventDetailComponent,
    VenueDetailComponent,
    ShowDetailComponent,
    PageEditComponent,
    EventEditComponent
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
    EventService,
    HttpHandlerService,
    JwtHelperService,
    SearchService,
    PageService,
    ShowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
