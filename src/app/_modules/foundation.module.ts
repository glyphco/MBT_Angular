import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { DateFormatterPipe } from '../pipes/date-formatter.pipe';
// import { MdNativeDateModule, MdDatepickerModule, MdInputModule } from '@angular/material';
// import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

import { AuthGuard } from '../_guards/auth.guard';
import { PublicGuard } from '../_guards/public.guard';

import { AuthService } from '../_services/auth.service';
import { HttpHandlerService } from '../_services/http-handler.service';
import { JwtHelperService } from '../_services/jwt-helper.service';
import { LocationService } from '../_services/location.service';
import { MeService } from '../_services/me.service';
import { AnnouncementService } from '../_services/announcement.service';
// import { EventService } from './_services/event.service';
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
    TruncatePipe,
    DateFormatterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    // MdNativeDateModule,
    // MdDatepickerModule,
    // MdInputModule,
    // ReactiveFormsModule,
    // FileUploadModule
  ],
  providers: [
    
    // AuthGuard,
    // PublicGuard
  
    // AuthService,
    // HttpHandlerService,
    // JwtHelperService,
    // LocationService,
    // MeService,
    // AnnouncementService

    // VenueService,
    // EventService,
    // SearchService,
    // PageService,
    // ShowService,
    // CategoryService,
    // UserService,
    // ImageUploadService,
    // SocialLoginService,
  ],
  exports: [
    DateFormatterPipe,
    TruncatePipe
  ]
})
export class FoundationModule { }
