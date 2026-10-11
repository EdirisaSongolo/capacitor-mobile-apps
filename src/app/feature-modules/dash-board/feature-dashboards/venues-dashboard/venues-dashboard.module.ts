import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImportsModules } from '@core-modules';
import { NgxMaskDirective } from 'ngx-mask';

import { VenuesDashboardRoutingModule } from '@venues-dashboard/venues-dashboard-routing.module';
import { VenueStoreModule } from '@venues-core/store/venues-store.module';
import { VenuesCoreModule } from '@app-core/venues-core/venues-core.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { UserProfileCoreModule } from '@app-core/user-profile-core/user-profile-core.module';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';
import { MediaCoreModule } from '@app-core/media-core/media-core.module';
import { ProfileRevenueCoreModule } from '@profile-revenue-core/profile-revenue-core.module';

import { VenuesDashboardMainComponent } from '@venues-dashboard/venues-dashboard-main/venues-dashboard-main.component';
import { VenueProfileDashboardComponent } from '@venues-dashboard/venue-profile-dashboard/venue-profile-dashboard.component';

import { VenueProfileDetailsComponent } from '@venues-dashboard/display-components';

@NgModule({
  declarations: [
    VenuesDashboardMainComponent,
    VenueProfileDashboardComponent,
    VenueProfileDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    TranslateModule,
    VenuesDashboardRoutingModule,
    VenueStoreModule,
    AppDomainModule,
    VenuesCoreModule,
    VenueStoreModule,
    ProfileAccountsCoreModule,
    UserProfileCoreModule,
    ProfileRevenueCoreModule,
    MediaCoreModule,
    NgxMaskDirective,
  ],
})
export class VenuesDashboardModule {}
