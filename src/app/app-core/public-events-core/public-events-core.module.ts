import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImportsModules } from '@core-modules';

import { PublicEventStoreModule } from '@public-events-core/store';
import { ProfileRevenueStoreModule } from '@profile-revenue-core/store';
import { VenuesCoreModule } from '@app-core/venues-core/venues-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { MediaCoreModule } from '@app-core/media-core/media-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';

import {
  PublicEventPlacComponent,
  PublicEventLocationPlacComponent,
  PublicEventDatePlacComponent,
} from '@app-core/public-events-core/components/placs';
import {
  PublicEventLocationsComponent,
  TicketSalesComponent,
} from '@public-events-core/components';
import {
  CreateEditLocationComponent,
  PublicEventLocationComponent,
} from '@public-events-core/components/public-event-locations/display-components';
import { CreateEditDateComponent } from '@public-events-core/components/public-event-locations/display-components/create-edit-date';
import {
  EventDateDetailsComponent,
  EventDateFeaturesComponent,
  EventDateVenueComponent,
} from '@public-events-core/components/public-event-locations/display-components/create-edit-date/display-components';
import {
  PublicEventStaffComponent,
  CreateEditStaffComponent,
} from '@public-events-core/components/public-event-staff';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    PublicEventStoreModule,
    ProfileRevenueStoreModule,
    VenuesCoreModule,
    VendorsCoreModule,
    AppDomainModule,
    MediaCoreModule,
    UserProfileCoreModule,
    ProfileAccountsCoreModule,
  ],
  declarations: [
    PublicEventPlacComponent,
    PublicEventLocationPlacComponent,
    PublicEventDatePlacComponent,
    PublicEventLocationsComponent,
    PublicEventStaffComponent,
    CreateEditDateComponent,
    CreateEditLocationComponent,
    PublicEventLocationComponent,
    EventDateVenueComponent,
    EventDateFeaturesComponent,
    CreateEditStaffComponent,
    EventDateDetailsComponent,
    TicketSalesComponent,
  ],
  exports: [
    PublicEventPlacComponent,
    PublicEventLocationPlacComponent,
    PublicEventDatePlacComponent,
    PublicEventLocationsComponent,
    PublicEventStaffComponent,
    TicketSalesComponent,
  ],
})
export class PublicEventsCoreModule {}
