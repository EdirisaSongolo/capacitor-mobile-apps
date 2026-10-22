import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UserAccountComponent } from '@user-account/user-account/user-account.component';
import { AccountSocialsComponent } from '@user-profile-core/components';
import { ProfileMediaComponent } from '@media-core/components';
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

import { UserAccountRoutes } from '@user-profile-core/data-models/user-account.routes';
import { PublicEventRoutes } from '@public-events-core/data-models';
import { PublicEventProfileDateDetailsComponent } from '@public-event-profile/display-components';

const routes: Routes = [
  {
    path: '',
    component: UserAccountComponent,
    children: [
      {
        path: '',
        redirectTo: UserAccountRoutes.USER_EVENTS,
        pathMatch: 'full',
      },
      {
        path: UserAccountRoutes.SOCIALS,
        component: AccountSocialsComponent,
      },
      {
        path: UserAccountRoutes.USER_EVENTS,
        component: UserEventsComponent,
      },
      {
        path: UserAccountRoutes.MEDIA,
        component: ProfileMediaComponent,
      },
      {
        path: `${UserAccountRoutes.EVENT_INVITATION}/:${UserAccountRoutes.EVENT_ID}`,
        component: UserInvitationComponent,
      },
      {
        path: `${UserAccountRoutes.SAVED_EVENT_DATE}/:${PublicEventRoutes.EVENT_DATE_ID}`,
        component: PublicEventProfileDateDetailsComponent,
      },
      {
        path: UserAccountRoutes.BOOKING,
        component: ManagedBookingRequestsComponent,
      },
      {
        path: `${UserAccountRoutes.BOOKING_REQUEST}/:${UserAccountRoutes.BOOKING_ID}`,
        component: BookingRequestComponent,
      },
      {
        path: UserAccountRoutes.ACTIONS,
        component: ManagedBookingInvoicesComponent,
      },
      {
        path: `${UserAccountRoutes.BOOKING_INVOICE}/:${UserAccountRoutes.BOOKING_ID}`,
        component: BookingInvoiceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAccountRoutingModule {}
