import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  PublicEventsDashboardMainComponent,
  PublicEventProfileDashboardComponent,
} from '@public-events-dashboard/index';
import {
  CancelPublicEventComponent,
  PublicEventAccountComponent,
  PublicEventDetailsComponent,
} from '@public-events-dashboard/display-components';
import { ProfileMediaComponent } from '@media-core/components';
import {
  PublicEventLocationsComponent,
  PublicEventStaffComponent,
} from '@public-events-core/components';
import { PublicEventDashboardRoutes } from '@public-events-core/data-models';

const routes: Routes = [
  { path: '', component: PublicEventsDashboardMainComponent },
  {
    path: PublicEventDashboardRoutes.DASHBOARD_PROFILE,
    component: PublicEventProfileDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: PublicEventDashboardRoutes.DETAILS,
        pathMatch: 'full',
      },
      {
        path: PublicEventDashboardRoutes.DETAILS,
        component: PublicEventDetailsComponent,
      },
      {
        path: PublicEventDashboardRoutes.MEDIA,
        component: ProfileMediaComponent,
      },
      {
        path: PublicEventDashboardRoutes.LOCATIONS,
        component: PublicEventLocationsComponent,
      },
      {
        path: PublicEventDashboardRoutes.STAFF,
        component: PublicEventStaffComponent,
      },
      {
        path: PublicEventDashboardRoutes.PRINCIPAL,
        component: PublicEventAccountComponent,
      },
      {
        path: PublicEventDashboardRoutes.CANCEL,
        component: CancelPublicEventComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicEventsDashboardRoutingModule {}
