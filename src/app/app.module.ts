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
import { PublicEventsTodayComponent } from './_components/public-events-today.component';
import { EventsTodayComponent } from './_components/events-today.component';
import { EventsCurrentComponent } from './_components/events-current.component';
import { ExploreComponent } from './_components/explore.component';
import { UserDetailComponent } from './_components/user-detail.component';
import { CategorySelectComponent } from './_components/category-select.component';
import { LocationPickerComponent } from './_components/location-picker.component';
import { ProfileEditComponent } from './_components/profile-edit.component';
import { UsersEditableComponent } from './_components/users-editable.component';
import { UserEditComponent } from './_components/user-edit.component';
import { ManageFollowersComponent } from './_components/manage-followers.component';
import { FollowerRequestsComponent } from './_components/follower-requests.component';
import { FollowersComponent } from './_components/followers.component';
import { FollowersBlockedComponent } from './_components/followers-blocked.component';
import { PyfComponent } from './_components/pyf.component';
import { ModalComponent } from './_components/modal.component';

import { AuthService } from './_services/auth.service';
import { VenueService } from './_services/venue.service';
import { EventService } from './_services/event.service';
import { SearchService } from './_services/search.service';
import { HttpHandlerService } from './_services/http-handler.service';
import { JwtHelperService } from './_services/jwt-helper.service';
import { PageService } from './_services/page.service';
import { ShowService } from './_services/show.service';
import { CategoryService } from './_services/category.service';
import { LocationService } from './_services/location.service';
import { MeService } from './_services/me.service';
import { UserService } from './_services/user.service';
import { ImageUploadService } from './_services/image-upload.service';
import { SocialLoginService } from './_services/social-login.service';
import { ErrorHandlerService } from './_services/error-handler.service';

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
    PublicEventsTodayComponent,
    EventsTodayComponent,
    EventsCurrentComponent,
    ExploreComponent,
    UserDetailComponent,
    CategorySelectComponent,
    LocationPickerComponent,
    ProfileEditComponent,
    UsersEditableComponent,
    UserEditComponent,
    ManageFollowersComponent,
    FollowerRequestsComponent,
    FollowersComponent,
    FollowersBlockedComponent,
    PyfComponent,
    ModalComponent
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
    AuthService,
    HttpHandlerService,
    VenueService,
    EventService,
    JwtHelperService,
    SearchService,
    PageService,
    ShowService,
    CategoryService,
    LocationService,
    MeService,
    UserService,
    ImageUploadService,
    SocialLoginService,
    ErrorHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
