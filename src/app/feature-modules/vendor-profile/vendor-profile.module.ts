import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorProfileRoutingModule } from '@vendor-profile/vendor-profile-routing.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';
import { ProfileRevenueCoreModule } from '@profile-revenue-core/profile-revenue-core.module';
import { MediaCoreModule } from '@media-core/media-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { MaterialImportsModules } from '@core-modules';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';

import { VendorProfileComponent } from '@vendor-profile/vendor-profile/vendor-profile.component';
import { VendorProfileHeaderComponent } from '@vendor-profile/vendor-profile-header/vendor-profile-header.component';

@NgModule({
  declarations: [VendorProfileComponent, VendorProfileHeaderComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialImportsModules,
    VendorProfileRoutingModule,
    AppDomainModule,
    VendorsCoreModule,
    ProfileRevenueCoreModule,
    MediaCoreModule,
    UserProfileCoreModule,
    ProfileAccountsCoreModule,
  ],
})
export class VendorProfileModule {}
