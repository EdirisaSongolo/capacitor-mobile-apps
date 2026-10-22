import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';

import { PublicEventsCoreModule } from '@public-events-core/public-events-core.module';
import { PublicEventsDashboardRoutingModule } from '@public-events-dashboard/public-events-dashboard-routing.module';
import { MediaCoreModule } from '@media-core/media-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';

import { PublicEventsDashboardMainComponent } from '@public-events-dashboard/public-events-dashboard-main/public-events-dashboard-main.component';
import { PublicEventProfileDashboardComponent } from '@public-events-dashboard/public-event-profile-dashboard/public-event-profile-dashboard.component';

import {
  PublicEventAccountComponent,
  PublicEventDetailsComponent,
  CancelPublicEventComponent,
  GatePersonelComponent,
  CreateEditGatePersonelComponent,
} from '@public-events-dashboard/display-components';

@NgModule({
  declarations: [
    PublicEventsDashboardMainComponent,
    PublicEventProfileDashboardComponent,
    PublicEventDetailsComponent,
    CancelPublicEventComponent,
    PublicEventAccountComponent,
    GatePersonelComponent,
    CreateEditGatePersonelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    PublicEventsDashboardRoutingModule,
    PublicEventsCoreModule,
    MediaCoreModule,
    VendorsCoreModule,
    UserProfileCoreModule,
    ProfileAccountsCoreModule,
  ],
})
export class PublicEventsDashboardModule {}
