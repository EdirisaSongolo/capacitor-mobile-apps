import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { VendorStoreModule } from '@vendors-core/store/vendors-store.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { MediaCoreModule } from '@app-core/media-core/media-core.module';

import {
  VendorPlacComponent,
  VendorProfileManagementComponent,
} from '@vendors-core/components';

@NgModule({
  declarations: [VendorPlacComponent, VendorProfileManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    VendorStoreModule,
    UserProfileCoreModule,
    AppDomainModule,
    MediaCoreModule,
  ],
  exports: [VendorPlacComponent, VendorProfileManagementComponent],
})
export class VendorsCoreModule {}
