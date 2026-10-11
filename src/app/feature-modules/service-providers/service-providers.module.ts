import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceProvidersRoutingModule } from '@service-providers/service-providers.routing.module';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';

import { ServiceProvidersComponent } from '@service-providers/service-providers/service-providers.component';

@NgModule({
  declarations: [ServiceProvidersComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    ServiceProvidersRoutingModule,
    AppDomainModule,
    ProfileAccountsCoreModule,
    UserProfileCoreModule,
    VendorsCoreModule,
  ],
})
export class ServiceProvidersModule {}
