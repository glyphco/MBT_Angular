import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { AuthGuard } from '../_guards/auth.guard';
// import { PublicGuard } from '../_guards/public.guard';

import { PublicEventsTodayComponent } from '../_components/public-events-today.component';
import { PublicComponent } from '../_components/public.component';


// const publicRoutes: Routes = [
//   { path: '', 
//     component: PublicComponent,
//     children: [ 
//       { path: '', component: PublicEventsTodayComponent }, // this component has no diference with the other children except for the shorter route.
//       // { path: 'somePath1', component: AComponentDeclaredInTheLazyModule1 },
//       // { path: 'somePath2', component: AComponentDeclaredInTheLazyModule2 },
//     ]
//   },
// ];

const publicRoutes: Routes = [
  { path: '', 
    component: PublicComponent,
    children: [ 
      { path: '', component: PublicEventsTodayComponent }, // this component has no diference with the other children except for the shorter route.
      // { path: 'somePath1', component: AComponentDeclaredInTheLazyModule1 },
      // { path: 'somePath2', component: AComponentDeclaredInTheLazyModule2 },
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(publicRoutes) ],
  exports: [ RouterModule ]
})
export class PublicRoutingModule {}