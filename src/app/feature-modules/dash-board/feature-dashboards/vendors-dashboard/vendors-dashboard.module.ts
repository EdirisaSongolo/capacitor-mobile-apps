import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { MaterialImportsModules } from '@core-modules';
import { VendorsDashboardRoutingModule } from '@vendors-dashboard/vendors-dashboard-routing.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { VendorsCoreModule } from '@app-core/vendors-core/vendors-core.module';
import { VendorStoreModule } from '@app-core/vendors-core/store';
import { ProfileRevenueCoreModule } from '@app-core/profile-revenue-core/profile-revenue-core.module';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { MediaCoreModule } from '@media-core/media-core.module';

import { VendorsDashboardMainComponent } from '@vendors-dashboard/vendors-dashboard-main/vendors-dashboard-main.component';
import { VendorProfileDashboardComponent } from '@vendors-dashboard/vendor-profile-dashboard/vendor-profile-dashboard.component';
import { VendorProfileDetailsComponent } from '@vendors-dashboard/display-components';

@NgModule({
  declarations: [
    VendorsDashboardMainComponent,
    VendorProfileDashboardComponent,
    VendorProfileDetailsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    AppDomainModule,
    VendorsDashboardRoutingModule,
    ProfileAccountsCoreModule,
    VendorsCoreModule,
    VendorStoreModule,
    UserProfileCoreModule,
    ProfileRevenueCoreModule,
    MediaCoreModule,
    NgxMaskDirective,
  ],
})
export class VendorsDashboardModule {}
