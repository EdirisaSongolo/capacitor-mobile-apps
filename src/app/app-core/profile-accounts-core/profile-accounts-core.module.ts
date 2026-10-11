import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileAccountsStoreModule } from '@profile-accounts-core/store/profile-accounts-store.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { MaterialImportsModules } from '@core-modules';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';

import {
  BusinessProfileComponent,
  ProviderServicePlacComponent,
} from '@profile-accounts-core/components/business-profile';
import {
  DomainServiceProvidersComponent,
  CreateUpdateBookingComponent,
  ServiceProviderComponent,
} from '@profile-accounts-core/components';
import {
  ProfileServicesComponent,
  ProfileRateComponent,
} from '@profile-accounts-core/components/_segments';
import {
  ProfileRateDialogComponent,
  ProfileServiceDialogComponent,
} from '@profile-accounts-core/components/business-profile/_dialogs';

@NgModule({
  declarations: [
    DomainServiceProvidersComponent,
    CreateUpdateBookingComponent,
    BusinessProfileComponent,
    ProviderServicePlacComponent,
    ServiceProviderComponent,
    ProfileServicesComponent,
    ProfileRateComponent,
    ProfileRateDialogComponent,
    ProfileServiceDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    ProfileAccountsStoreModule,
    UserProfileCoreModule,
    VendorsCoreModule,
  ],
  exports: [
    DomainServiceProvidersComponent,
    CreateUpdateBookingComponent,
    BusinessProfileComponent,
    ProviderServicePlacComponent,
    ServiceProviderComponent,
    ProfileServicesComponent,
    ProfileRateComponent,
  ],
})
export class ProfileAccountsCoreModule {}
