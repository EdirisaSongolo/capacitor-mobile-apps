import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { MediaCoreModule } from '@media-core/media-core.module';
import { UserProfileRoutingModule } from '@user-profile/user-profile-routing.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { PrivateEventsCoreModule } from '@private-events-core/private-events-core.module';
import { ProfileRevenueCoreModule } from '@profile-revenue-core/profile-revenue-core.module';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';

import { UserProfileComponent } from '@user-profile/user-profile/user-profile.component';
import { UserProfileHeaderComponent } from '@user-profile/user-profile-header/user-profile-header.component';
import { UserSocialsComponent } from '@user-profile/display-components';

@NgModule({
  declarations: [
    UserProfileComponent,
    UserProfileHeaderComponent,
    UserSocialsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialImportsModules,
    UserProfileRoutingModule,
    AppDomainModule,
    MediaCoreModule,
    UserProfileCoreModule,
    PrivateEventsCoreModule,
    ProfileRevenueCoreModule,
    ProfileAccountsCoreModule,
  ],
})
export class UserProfileModule {}
