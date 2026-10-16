import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModules } from '@core-modules';

import { PrivateEventStoreModule } from '@private-events-core/store';
import { VenuesCoreModule } from '@app-core/venues-core/venues-core.module';
import { UserProfileCoreModule } from '@app-core/user-profile-core/user-profile-core.module';
import { VendorsCoreModule } from '@app-core/vendors-core/vendors-core.module';
import { MediaCoreModule } from '@app-core/media-core/media-core.module';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';
import { PrivateEventPlacComponent } from '@private-events-core/components/placs/private-event-plac/private-event-plac.component';

import {
  PrivateEventGuestsComponent,
  PrivateEventStaffComponent,
  PrivateEventLocationComponent,
} from '@private-events-core/components';
import {
  EventVenueComponent,
  EventDetailsComponent,
  EventFeaturesComponent,
} from '@private-events-core/components/private-event-location/display-components';
import { AppDomainModule } from '@app-domain/app-domain.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    PrivateEventStoreModule,
    ProfileAccountsCoreModule,
    VenuesCoreModule,
    VendorsCoreModule,
    UserProfileCoreModule,
    MediaCoreModule,
  ],
  declarations: [
    PrivateEventPlacComponent,
    PrivateEventLocationComponent,
    PrivateEventGuestsComponent,
    PrivateEventStaffComponent,
    PrivateEventGuestsComponent,
    EventVenueComponent,
    EventFeaturesComponent,
    EventDetailsComponent,
  ],
  exports: [
    PrivateEventPlacComponent,
    PrivateEventLocationComponent,
    PrivateEventGuestsComponent,
    PrivateEventStaffComponent,
    PrivateEventGuestsComponent,
  ],
})
export class PrivateEventsCoreModule {}
