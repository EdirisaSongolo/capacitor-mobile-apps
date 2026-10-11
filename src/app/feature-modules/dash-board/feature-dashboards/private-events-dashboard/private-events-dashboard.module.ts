import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';

import { PrivateEventsCoreModule } from '@private-events-core/private-events-core.module';
import { PrivateEventsDashboardRoutingModule } from '@private-events-dashboard/private-events-dashboard-routing.module';

import { PrivateEventsDashboardMainComponent } from '@private-events-dashboard/private-events-dashboard-main/private-events-dashboard-main.component';
import { PrivateEventProfileDashboardComponent } from '@private-events-dashboard/private-event-profile-dashboard/private-event-profile-dashboard.component';

import {
  PrivateEventDetailsComponent,
  PrivateEventAccountComponent,
  CancelPrivateEventComponent,
} from '@private-events-dashboard/display-components';
import { MediaCoreModule } from '@app-core/media-core/media-core.module';

@NgModule({
  declarations: [
    PrivateEventsDashboardMainComponent,
    PrivateEventProfileDashboardComponent,
    PrivateEventDetailsComponent,
    PrivateEventAccountComponent,
    CancelPrivateEventComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    AppDomainModule,
    PrivateEventsDashboardRoutingModule,
    PrivateEventsCoreModule,
    MediaCoreModule,
  ],
})
export class PrivateEventsDashboardModule {}
