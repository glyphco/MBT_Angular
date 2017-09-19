import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../_components/login.component';

const loginRoutes: Routes = [
  { path: '', 
    component: LoginComponent,
    children: [ 
      //{ path: '', component: LoginComponent }, // this component has no diference with the other children except for the shorter route.
      // { path: 'somePath1', component: AComponentDeclaredInTheLazyModule1 },
      // { path: 'somePath2', component: AComponentDeclaredInTheLazyModule2 },
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(loginRoutes) ],
  exports: [ RouterModule ]
})
export class LoginRoutingModule {}