import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoundationModule } from '../_modules/foundation.module';
import { PublicRoutingModule } from './public-routing.module';

import { PublicComponent } from '../_components/public.component';
import { PublicEventsTodayComponent } from '../_components/public-events-today.component';

import { EventService } from '../_services/event.service';


@NgModule({
  declarations: [
    PublicComponent,
    PublicEventsTodayComponent
  ],
  imports: [
    FoundationModule,
    CommonModule,
    PublicRoutingModule,
  ],
  providers: [
    // EventService,
  ]
})
export class PublicModule { }
