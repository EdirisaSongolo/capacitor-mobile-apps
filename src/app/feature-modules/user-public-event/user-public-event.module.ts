import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-domain/app-domain.module';
import { PublicEventsCoreModule } from '@public-events-core/public-events-core.module';
import { ProfileRevenueCoreModule } from '@profile-revenue-core/profile-revenue-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { VenuesCoreModule } from '@venues-core/venues-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';
import { UserPublicEventRoutingModule } from '@user-public-event/user-public-event.routing.module';

import { UserPublicEventComponent } from '@user-public-event/user-public-event/user-public-event.component';
import { MediaCoreModule } from '@media-core/media-core.module';
import { CommunicationsCoreModule } from '@communications-core/communications-core.module';

@NgModule({
  declarations: [UserPublicEventComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    PublicEventsCoreModule,
    ProfileRevenueCoreModule,
    UserProfileCoreModule,
    VenuesCoreModule,
    VendorsCoreModule,
    UserPublicEventRoutingModule,
    MediaCoreModule,
    CommunicationsCoreModule,

    QRCodeComponent,
  ],
})
export class UserPublicEventModule {}
