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
import { VenueCreateComponent } from './_components/venue-create.component';
import { ShowsComponent } from './_components/shows.component';
import { SearchComponent } from './_components/search.component';
import { PagesComponent } from './_components/pages.component';
import { PageDetailComponent } from './_components/page-detail.component';
import { PageEditComponent } from './_components/page-edit.component';
import { PageCreateComponent } from './_components/page-create.component';
import { EventDetailComponent } from './_components/event-detail.component';
import { VenueDetailComponent } from './_components/venue-detail.component';
import { ShowDetailComponent } from './_components/show-detail.component';
import { ShowEditComponent } from './_components/show-edit.component';
import { ShowCreateComponent } from './_components/show-create.component';
import { EventEditComponent } from './_components/event-edit.component';
import { EventCreateComponent } from './_components/event-create.component';
import { DatepickerComponent } from './_components/datepicker.component';

import { AuthService } from './_services/auth.service';
import { VenueService } from './_services/venue.service';
import { EventService } from './_services/event.service';
import { SearchService } from './_services/search.service';
import { HttpHandlerService } from './_services/http-handler.service';
import { JwtHelperService } from './_services/jwt-helper.service';
import { PageService } from './_services/page.service';
import { ShowService } from './_services/show.service';
import { CategoryService } from './_services/category.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EventsComponent,
    VenuesComponent,
    VenueCreateComponent,
    ShowsComponent,
    SearchComponent,
    PagesComponent,
    PageDetailComponent,
    PageCreateComponent,
    EventDetailComponent,
    VenueDetailComponent,
    ShowDetailComponent,
    ShowEditComponent,
    ShowCreateComponent,
    PageEditComponent,
    EventEditComponent,
    EventCreateComponent,
    DatepickerComponent
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
    ShowService,
    CategoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
