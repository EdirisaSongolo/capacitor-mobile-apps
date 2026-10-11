import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateEventsRoutes } from '@private-events-core/data-models';

import {
  PrivateEventsDashboardMainComponent,
  PrivateEventProfileDashboardComponent,
} from '@private-events-dashboard/index';
import {
  CancelPrivateEventComponent,
  PrivateEventDetailsComponent,
} from './display-components';
import { ProfileMediaComponent } from '@media-core/components';
import {
  PrivateEventLocationComponent,
  PrivateEventGuestsComponent,
  PrivateEventStaffComponent,
} from '@private-events-core/components';

const routes: Routes = [
  { path: '', component: PrivateEventsDashboardMainComponent },
  {
    path: PrivateEventsRoutes.DASHBOARD_PROFILE,
    component: PrivateEventProfileDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: PrivateEventsRoutes.DETAILS,
        pathMatch: 'full',
      },
      {
        path: PrivateEventsRoutes.DETAILS,
        component: PrivateEventDetailsComponent,
      },
      {
        path: PrivateEventsRoutes.MEDIA,
        component: ProfileMediaComponent,
      },
      {
        path: PrivateEventsRoutes.LOCATION,
        component: PrivateEventLocationComponent,
      },
      {
        path: PrivateEventsRoutes.STAFF,
        component: PrivateEventStaffComponent,
      },
      {
        path: PrivateEventsRoutes.GUESTS,
        component: PrivateEventGuestsComponent,
      },
      {
        path: PrivateEventsRoutes.CANCEL,
        component: CancelPrivateEventComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateEventsDashboardRoutingModule {}
