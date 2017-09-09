import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoundationModule } from '../_modules/foundation.module';
import { PublicRoutingModule } from './public-routing.module';

//import { DateFormatterPipe } from './pipes/date-formatter.pipe';

// import { MdNativeDateModule, MdDatepickerModule, MdInputModule } from '@angular/material';
// import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';


import { PublicEventsTodayComponent } from '../_components/public-events-today.component';
// import { LoginComponent } from './_components/login.component';
// import { BackstageComponent } from './_components/backstage.component';
// import { EventsEditableComponent } from './_components/events-editable.component';
// import { VenuesEditableComponent } from './_components/venues-editable.component';
// import { VenueCreateComponent } from './_components/venue-create.component';
// import { ShowsEditableComponent } from './_components/shows-editable.component';
// import { SearchComponent } from './_components/search.component';
// import { PagesEditableComponent } from './_components/pages-editable.component';
// import { PageDetailComponent } from './_components/page-detail.component';
// import { PageEditComponent } from './_components/page-edit.component';
// import { PageCreateComponent } from './_components/page-create.component';
// import { PageDeleteComponent } from './_components/page-delete.component';
// import { EventDetailComponent } from './_components/event-detail.component';
// import { EventFullComponent } from './_components/event-full.component';
// import { EventDeleteComponent } from './_components/event-delete.component';
// import { VenueDetailComponent } from './_components/venue-detail.component';
// import { VenueEditComponent } from './_components/venue-edit.component';
// import { VenueDeleteComponent } from './_components/venue-delete.component';
// import { ShowDetailComponent } from './_components/show-detail.component';
// import { ShowEditComponent } from './_components/show-edit.component';
// import { ShowDeleteComponent } from './_components/show-delete.component';
// import { ShowCreateComponent } from './_components/show-create.component';
// import { EventEditComponent } from './_components/event-edit.component';
// import { EventCreateComponent } from './_components/event-create.component';
// import { DatepickerComponent } from './_components/datepicker.component';
// import { EventsTodayComponent } from './_components/events-today.component';
// import { EventsCurrentComponent } from './_components/events-current.component';
// import { ExploreComponent } from './_components/explore.component';
// import { UserDetailComponent } from './_components/user-detail.component';
// import { CategorySelectComponent } from './_components/category-select.component';
// import { ProfileEditComponent } from './_components/profile-edit.component';
// import { UsersEditableComponent } from './_components/users-editable.component';
// import { UserEditComponent } from './_components/user-edit.component';
// import { ManageFollowersComponent } from './_components/manage-followers.component';
// import { FollowerRequestsComponent } from './_components/follower-requests.component';
// import { FollowersComponent } from './_components/followers.component';
// import { FollowersBlockedComponent } from './_components/followers-blocked.component';
// import { PyfComponent } from './_components/pyf.component';
// import { ModalComponent } from './_components/modal.component';

import { EventService } from '../_services/event.service';
// import { VenueService } from './_services/venue.service';
// import { SearchService } from './_services/search.service';
// import { PageService } from './_services/page.service';
// import { ShowService } from './_services/show.service';
// import { CategoryService } from './_services/category.service';
// import { UserService } from './_services/user.service';
// import { ImageUploadService } from './_services/image-upload.service';
// import { SocialLoginService } from './_services/social-login.service';


@NgModule({
  declarations: [
    //DateFormatterPipe,
    PublicEventsTodayComponent,
    // LoginComponent,
    // BackstageComponent,
    // EventsEditableComponent,
    // VenuesEditableComponent,
    // VenueCreateComponent,
    // VenueEditComponent,
    // VenueDeleteComponent,
    // ShowsEditableComponent,
    // SearchComponent,
    // PagesEditableComponent,
    // PageDetailComponent,
    // EventFullComponent,
    // EventDeleteComponent,
    // PageCreateComponent,
    // PageDeleteComponent,
    // EventDetailComponent,
    // VenueDetailComponent,
    // ShowDetailComponent,
    // ShowEditComponent,
    // ShowDeleteComponent,
    // ShowCreateComponent,
    // PageEditComponent,
    // EventEditComponent,
    // EventCreateComponent,
    // DatepickerComponent,
    // EventsTodayComponent,
    // EventsCurrentComponent,
    // ExploreComponent,
    // UserDetailComponent,
    // CategorySelectComponent,
    // ProfileEditComponent,
    // UsersEditableComponent,
    // UserEditComponent,
    // ManageFollowersComponent,
    // FollowerRequestsComponent,
    // FollowersComponent,
    // FollowersBlockedComponent,
    // PyfComponent,
    // ModalComponent
  ],
  imports: [
    FoundationModule,
    CommonModule,
    PublicRoutingModule,
    //RouterModule,
    // MdNativeDateModule,
    // MdDatepickerModule,
    // MdInputModule,
    // ReactiveFormsModule,
    // FileUploadModule
  ],
  providers: [
    // VenueService,
    EventService,
    // SearchService,
    // PageService,
    // ShowService,
    // CategoryService,
    // UserService,
    // ImageUploadService,
    // SocialLoginService,
  ]
})
export class PublicModule { }
