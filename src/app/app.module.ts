import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { MdNativeDateModule, MdDatepickerModule, MdInputModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { TruncatePipe } from './pipes/truncate.pipe';
import { DateFormatterPipe } from './pipes/date-formatter.pipe';

import { AuthGuard } from './_guards/auth.guard';
import { PublicGuard } from './_guards/public.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './_components/login.component';
import { BackstageComponent } from './_components/backstage.component';
import { EventsEditableComponent } from './_components/events-editable.component';
import { VenuesEditableComponent } from './_components/venues-editable.component';
import { VenueCreateComponent } from './_components/venue-create.component';
import { ShowsEditableComponent } from './_components/shows-editable.component';
import { SearchComponent } from './_components/search.component';
import { PagesEditableComponent } from './_components/pages-editable.component';
import { PageDetailComponent } from './_components/page-detail.component';
import { PageEditComponent } from './_components/page-edit.component';
import { PageCreateComponent } from './_components/page-create.component';
import { PageDeleteComponent } from './_components/page-delete.component';
import { EventDetailComponent } from './_components/event-detail.component';
import { EventFullComponent } from './_components/event-full.component';
import { EventDeleteComponent } from './_components/event-delete.component';
import { VenueDetailComponent } from './_components/venue-detail.component';
import { VenueEditComponent } from './_components/venue-edit.component';
import { VenueDeleteComponent } from './_components/venue-delete.component';
import { ShowDetailComponent } from './_components/show-detail.component';
import { ShowEditComponent } from './_components/show-edit.component';
import { ShowDeleteComponent } from './_components/show-delete.component';
import { ShowCreateComponent } from './_components/show-create.component';
import { EventEditComponent } from './_components/event-edit.component';
import { EventCreateComponent } from './_components/event-create.component';
import { DatepickerComponent } from './_components/datepicker.component';
import { PublicEventsComponent } from './_components/public-events.component';
import { ExploreComponent } from './_components/explore.component';
import { ProfileComponent } from './_components/profile.component';
import { CategorySelectComponent } from './_components/category-select.component';
import { LocationPickerComponent } from './_components/location-picker.component';

import { AuthService } from './_services/auth.service';
import { VenueService } from './_services/venue.service';
import { EventService } from './_services/event.service';
import { SearchService } from './_services/search.service';
import { HttpHandlerService } from './_services/http-handler.service';
import { JwtHelperService } from './_services/jwt-helper.service';
import { PageService } from './_services/page.service';
import { ShowService } from './_services/show.service';
import { CategoryService } from './_services/category.service';
import { EventVenueService } from './_services/event-venue.service';
import { LocationService } from './_services/location.service';
import { MeService } from './_services/me.service';

@NgModule({
  declarations: [
    TruncatePipe,
    DateFormatterPipe,
    AppComponent,
    LoginComponent,
    BackstageComponent,
    EventsEditableComponent,
    VenuesEditableComponent,
    VenueCreateComponent,
    VenueEditComponent,
    VenueDeleteComponent,
    ShowsEditableComponent,
    SearchComponent,
    PagesEditableComponent,
    PageDetailComponent,
    EventFullComponent,
    EventDeleteComponent,
    PageCreateComponent,
    PageDeleteComponent,
    EventDetailComponent,
    VenueDetailComponent,
    ShowDetailComponent,
    ShowEditComponent,
    ShowDeleteComponent,
    ShowCreateComponent,
    PageEditComponent,
    EventEditComponent,
    EventCreateComponent,
    DatepickerComponent,
    PublicEventsComponent,
    ExploreComponent,
    ProfileComponent,
    CategorySelectComponent,
    LocationPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdNativeDateModule,
    MdDatepickerModule,
    MdInputModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  providers: [
    AuthGuard,
    PublicGuard,
    HttpHandlerService,
    AuthService,
    VenueService,
    EventService,
    JwtHelperService,
    SearchService,
    PageService,
    ShowService,
    CategoryService,
    EventVenueService,
    LocationService,
    MeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
