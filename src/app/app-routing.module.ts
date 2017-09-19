import { NgModule }             from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuard } from './_guards/auth.guard';
import { PublicGuard } from './_guards/public.guard';

// import { BackstageComponent } from './_components/backstage.component';
// import { LoginComponent } from './_components/login.component';
// import { SearchComponent } from './_components/search.component';
// import { PageDetailComponent } from './_components/page-detail.component';
// import { PageCreateComponent } from './_components/page-create.component';
// import { EventDetailComponent } from './_components/event-detail.component';
// import { EventFullComponent } from './_components/event-full.component';
// import { VenueDetailComponent } from './_components/venue-detail.component';
// import { VenueCreateComponent } from './_components/venue-create.component';
// import { ShowDetailComponent } from './_components/show-detail.component';
// import { ShowEditComponent } from './_components/show-edit.component';
// import { ShowDeleteComponent } from './_components/show-delete.component';
// import { ShowCreateComponent } from './_components/show-create.component';
// import { ShowsEditableComponent } from './_components/shows-editable.component';
// import { PageEditComponent } from './_components/page-edit.component';
// import { PageDeleteComponent } from './_components/page-delete.component';
// import { EventEditComponent } from './_components/event-edit.component';
// import { EventDeleteComponent } from './_components/event-delete.component';
// import { EventCreateComponent } from './_components/event-create.component';
import { PublicEventsTodayComponent } from './_components/public-events-today.component';
// import { EventsTodayComponent } from './_components/events-today.component';
// import { EventsCurrentComponent } from './_components/events-current.component';
// import { ExploreComponent } from './_components/explore.component';
// import { EventsEditableComponent } from './_components/events-editable.component';
// import { PagesEditableComponent } from './_components/pages-editable.component';
// import { VenuesEditableComponent } from './_components/venues-editable.component';
// import { VenueEditComponent } from './_components/venue-edit.component';
// import { VenueDeleteComponent } from './_components/venue-delete.component';
// import { UserDetailComponent } from './_components/user-detail.component';
// import { ProfileEditComponent } from './_components/profile-edit.component';
// import { UsersEditableComponent } from './_components/users-editable.component';
// import { UserEditComponent } from './_components/user-edit.component';
// import { ManageFollowersComponent } from './_components/manage-followers.component';

const routes: Routes = [
  { path: 'login', loadChildren: './_modules/login.module#LoginModule', canActivate: [PublicGuard] },
  // { path: 'backstage', component: BackstageComponent, canActivate: [AuthGuard] },
  // { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  // { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuard] },
  // { path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  // //Page routes
  // { path: 'page/create', component: PageCreateComponent, canActivate: [AuthGuard] },
  // { path: 'page/:id', component: PageDetailComponent, canActivate: [AuthGuard] },
  // { path: 'page/edit/:id', component: PageEditComponent, canActivate: [AuthGuard] },
  // { path: 'page/delete/:id', component: PageDeleteComponent, canActivate: [AuthGuard] },
  // { path: 'pages/editable', component: PagesEditableComponent, canActivate: [AuthGuard] },
  // //Venue routes
  // { path: 'venue/create', component: VenueCreateComponent, canActivate: [AuthGuard] },
  // { path: 'venue/:id', component: VenueDetailComponent },
  // { path: 'venues/editable', component: VenuesEditableComponent, canActivate: [AuthGuard] },
  // { path: 'venue/edit/:id', component: VenueEditComponent, canActivate: [AuthGuard] },
  // { path: 'venue/delete/:id', component: VenueDeleteComponent, canActivate: [AuthGuard] },
  // //Event routes
  // { path: 'event/create', component: EventCreateComponent, canActivate: [AuthGuard] },
  // { path: 'event/:id', component: EventDetailComponent, canActivate: [AuthGuard] },
  // { path: 'event/edit/:id', component: EventEditComponent, canActivate: [AuthGuard] },
  // { path: 'event/full/:id', component: EventFullComponent, canActivate: [AuthGuard] },
  // { path: 'event/delete/:id', component: EventDeleteComponent, canActivate: [AuthGuard] },
  // { path: 'events/editable', component: EventsEditableComponent, canActivate: [AuthGuard] },
  // { path: 'events/today', component: EventsTodayComponent, canActivate: [AuthGuard] },
  // { path: 'events/current', component: EventsCurrentComponent, canActivate: [AuthGuard] },
  // //Show routes
  // { path: 'show/create', component: ShowCreateComponent, canActivate: [AuthGuard] },
  // { path: 'show/:id', component: ShowDetailComponent, canActivate: [AuthGuard] },
  // { path: 'show/edit/:id', component: ShowEditComponent, canActivate: [AuthGuard] },
  // { path: 'show/delete/:id', component: ShowDeleteComponent, canActivate: [AuthGuard] },
  // { path: 'shows/editable', component: ShowsEditableComponent, canActivate: [AuthGuard] },
  // //User routes
  // { path: 'users/editable', component: UsersEditableComponent, canActivate: [AuthGuard] },
  // { path: 'user/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
  // { path: 'manage/followers', component: ManageFollowersComponent, canActivate: [AuthGuard] },

  // { path: 'explore', component: ExploreComponent, canActivate: [AuthGuard] },
  { path: 'events', loadChildren: './_modules/public.module#PublicModule', canActivate: [PublicGuard] },
  
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