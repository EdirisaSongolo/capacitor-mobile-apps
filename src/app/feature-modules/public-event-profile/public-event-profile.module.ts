import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { PublicEventProfileRoutingModule } from '@public-event-profile/public-event-profile.routing.module';
import { PublicEventsCoreModule } from '@public-events-core/public-events-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';
import { VenuesCoreModule } from '@venues-core/venues-core.module';
import { ProfileRevenueCoreModule } from '@profile-revenue-core/profile-revenue-core.module';
import { MediaCoreModule } from '@media-core/media-core.module';
import { UserProfileCoreModule } from '@app-core/user-profile-core/user-profile-core.module';

import { PublicEventProfileComponent } from '@public-event-profile/public-event-profile/public-event-profile.component';
import { PublicEventHeaderComponent } from '@public-event-profile/public-event-header/public-event-header.component';
import {
  PublicEventProfileDateDetailsComponent,
  PublicEventProfileDatesComponent,
  PublicEventProfileFeaturesComponent,
  PublicEventProfileLocationsComponent,
  PublicEventProfileMerchComponent,
} from '@public-event-profile/display-components';

@NgModule({
  declarations: [
    PublicEventProfileComponent,
    PublicEventHeaderComponent,
    PublicEventProfileLocationsComponent,
    PublicEventProfileDatesComponent,
    PublicEventProfileFeaturesComponent,
    PublicEventProfileMerchComponent,
    PublicEventProfileDateDetailsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    PublicEventProfileRoutingModule,
    PublicEventsCoreModule,
    VendorsCoreModule,
    VenuesCoreModule,
    ProfileRevenueCoreModule,
    MediaCoreModule,
    UserProfileCoreModule,
  ],
  exports: [PublicEventProfileDateDetailsComponent],
})
export class PublicEventProfileModule {}
