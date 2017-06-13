import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuard } from './_guards/auth.guard';
import { PublicGuard } from './_guards/public.guard';

import { DashboardComponent } from './_components/dashboard.component';
import { LoginComponent } from './_components/login.component';
import { SearchComponent } from './_components/search.component';
import { PageDetailComponent } from './_components/page-detail.component';
import { EventDetailComponent } from './_components/event-detail.component';
import { VenueDetailComponent } from './_components/venue-detail.component';
import { ShowDetailComponent } from './_components/show-detail.component';
import { PageEditComponent } from './_components/page-edit.component';
import { EventEditComponent } from './_components/event-edit.component';
import { EventCreateComponent } from './_components/event-create.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [PublicGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'page/:id', component: PageDetailComponent, canActivate: [AuthGuard] },
  { path: 'page/edit/:id', component: PageEditComponent, canActivate: [AuthGuard] },
  { path: 'venue/:id', component: VenueDetailComponent, canActivate: [AuthGuard] },
  { path: 'event/create', component: EventCreateComponent, canActivate: [AuthGuard] },
  { path: 'event/:id', component: EventDetailComponent, canActivate: [AuthGuard] },
  { path: 'event/edit/:id', component: EventEditComponent, canActivate: [AuthGuard] },
  { path: 'show/:id', component: ShowDetailComponent, canActivate: [AuthGuard] },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}