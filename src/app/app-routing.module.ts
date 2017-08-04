import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuard } from './_guards/auth.guard';
import { PublicGuard } from './_guards/public.guard';

import { BackstageComponent } from './_components/backstage.component';
import { LoginComponent } from './_components/login.component';
import { SearchComponent } from './_components/search.component';
import { PageDetailComponent } from './_components/page-detail.component';
import { PageCreateComponent } from './_components/page-create.component';
import { EventDetailComponent } from './_components/event-detail.component';
import { EventFullComponent } from './_components/event-full.component';
import { VenueDetailComponent } from './_components/venue-detail.component';
import { VenueCreateComponent } from './_components/venue-create.component';
import { ShowDetailComponent } from './_components/show-detail.component';
import { ShowEditComponent } from './_components/show-edit.component';
import { ShowDeleteComponent } from './_components/show-delete.component';
import { ShowCreateComponent } from './_components/show-create.component';
import { ShowsEditableComponent } from './_components/shows-editable.component';
import { PageEditComponent } from './_components/page-edit.component';
import { PageDeleteComponent } from './_components/page-delete.component';
import { EventEditComponent } from './_components/event-edit.component';
import { EventDeleteComponent } from './_components/event-delete.component';
import { EventCreateComponent } from './_components/event-create.component';
import { PublicEventsComponent } from './_components/public-events.component';
import { ExploreComponent } from './_components/explore.component';
import { EventsEditableComponent } from './_components/events-editable.component';
import { PagesEditableComponent } from './_components/pages-editable.component';
import { VenuesEditableComponent } from './_components/venues-editable.component';
import { VenueEditComponent } from './_components/venue-edit.component';
import { VenueDeleteComponent } from './_components/venue-delete.component';
import { ProfileComponent } from './_components/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [PublicGuard] },
  { path: 'backstage', component: BackstageComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  //Page routes
  { path: 'page/create', component: PageCreateComponent, canActivate: [AuthGuard] },
  { path: 'page/:id', component: PageDetailComponent, canActivate: [AuthGuard] },
  { path: 'page/edit/:id', component: PageEditComponent, canActivate: [AuthGuard] },
  { path: 'page/delete/:id', component: PageDeleteComponent, canActivate: [AuthGuard] },
  { path: 'pages/editable', component: PagesEditableComponent, canActivate: [AuthGuard] },
  //Venue routes
  { path: 'venue/create', component: VenueCreateComponent, canActivate: [AuthGuard] },
  { path: 'venue/:id', component: VenueDetailComponent },
  { path: 'venues/editable', component: VenuesEditableComponent, canActivate: [AuthGuard] },
  { path: 'venue/edit/:id', component: VenueEditComponent, canActivate: [AuthGuard] },
  { path: 'venue/delete/:id', component: VenueDeleteComponent, canActivate: [AuthGuard] },
  //Event routes
  { path: 'event/create', component: EventCreateComponent, canActivate: [AuthGuard] },
  { path: 'event/:id', component: EventDetailComponent, canActivate: [AuthGuard] },
  { path: 'event/edit/:id', component: EventEditComponent, canActivate: [AuthGuard] },
  { path: 'event/full/:id', component: EventFullComponent, canActivate: [AuthGuard] },
  { path: 'event/delete/:id', component: EventDeleteComponent, canActivate: [AuthGuard] },
  { path: 'events/editable', component: EventsEditableComponent, canActivate: [AuthGuard] },
  //Show routes
  { path: 'show/create', component: ShowCreateComponent, canActivate: [AuthGuard] },
  { path: 'show/:id', component: ShowDetailComponent, canActivate: [AuthGuard] },
  { path: 'show/edit/:id', component: ShowEditComponent, canActivate: [AuthGuard] },
  { path: 'show/delete/:id', component: ShowDeleteComponent, canActivate: [AuthGuard] },
  { path: 'shows/editable', component: ShowsEditableComponent, canActivate: [AuthGuard] },


  { path: 'explore', component: ExploreComponent, canActivate: [AuthGuard] },
  { path: 'events', component: PublicEventsComponent },
  
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', redirectTo: 'events', pathMatch: 'full' },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}