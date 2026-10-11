import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModules } from '@core-modules';
import { UserAccountRoutingModule } from '@user-account/user-account.routing-module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { MediaCoreModule } from '@app-core/media-core/media-core.module';
import { VenuesCoreModule } from '@venues-core/venues-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { PublicEventsCoreModule } from '@public-events-core/public-events-core.module';
import { PrivateEventsCoreModule } from '@private-events-core/private-events-core.module';
import { ProfileRevenueCoreModule } from '@profile-revenue-core/profile-revenue-core.module';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';
import { PublicEventProfileModule } from '@public-event-profile/public-event-profile.module';

import { UserAccountComponent } from '@user-account/user-account/user-account.component';
import { UserAccountHeaderComponent } from '@user-account/user-account-header/user-account-header.component';
import {
  ManagedBookingRequestsComponent,
  BookingRequestComponent,
} from '@user-account/display-components/booking-requests';
import {
  ManagedBookingInvoicesComponent,
  BookingInvoiceComponent,
} from '@user-account/display-components/booking-invoices';
import {
  UserEventsComponent,
  UserInvitationComponent,
} from '@user-account/display-components/user-events';

@NgModule({
  declarations: [
    UserAccountComponent,
    UserAccountHeaderComponent,
    UserEventsComponent,
    UserInvitationComponent,
    ManagedBookingRequestsComponent,
    BookingRequestComponent,
    ManagedBookingInvoicesComponent,
    BookingInvoiceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    TranslateModule,
    UserAccountRoutingModule,
    AppDomainModule,
    MediaCoreModule,
    UserProfileCoreModule,
    VenuesCoreModule,
    VendorsCoreModule,
    PrivateEventsCoreModule,
    ProfileRevenueCoreModule,
    PublicEventsCoreModule,
    ProfileAccountsCoreModule,
    PublicEventProfileModule,
  ],
})
export class UserAccountModule {}
