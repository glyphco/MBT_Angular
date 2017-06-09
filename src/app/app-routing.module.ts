import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuard } from './_guards/auth.guard';
import { PublicGuard } from './_guards/public.guard';

import { DashboardComponent } from './_components/dashboard.component';
import { LoginComponent } from './_components/login.component';
import { SearchComponent } from './_components/search.component';
import { PageDetailComponent } from './_components/page-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [PublicGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'page/:id', component: PageDetailComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}