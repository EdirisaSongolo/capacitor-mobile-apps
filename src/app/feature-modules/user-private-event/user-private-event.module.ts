import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-domain/app-domain.module';
import { PrivateEventsCoreModule } from '@private-events-core/private-events-core.module';
import { VenuesCoreModule } from '@venues-core/venues-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { MediaCoreModule } from '@media-core/media-core.module';
import { CommunicationsCoreModule } from '@communications-core/communications-core.module';
import { UserPrivateEventRoutingModule } from '@user-private-event/user-private-event.routing.module';

import { UserPrivateEventComponent } from '@user-private-event/user-private-event/user-private-event.component';
import {
  EventGuestsComponent,
  EventFeaturesComponent,
} from '@user-private-event/display-components';

@NgModule({
  declarations: [
    UserPrivateEventComponent,
    EventGuestsComponent,
    EventFeaturesComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    PrivateEventsCoreModule,
    VenuesCoreModule,
    VendorsCoreModule,
    UserProfileCoreModule,
    MediaCoreModule,
    CommunicationsCoreModule,
    UserPrivateEventRoutingModule,
  ],
})
export class UserPrivateEventModule {}
