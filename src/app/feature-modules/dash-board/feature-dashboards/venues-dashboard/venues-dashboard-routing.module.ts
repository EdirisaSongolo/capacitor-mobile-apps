import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VenuesDashboardRoutes } from '@venues-core/data-models';

import {
  VenuesDashboardMainComponent,
  VenueProfileDashboardComponent,
} from '@venues-dashboard/index';
import { VenueProfileDetailsComponent } from './display-components';
import { ProfileMediaComponent } from '@media-core/components';
import { BusinessProfileComponent } from '@profile-accounts-core/components';
import { RevenueAccountComponent } from '@profile-revenue-core/components';

const routes: Routes = [
  { path: '', component: VenuesDashboardMainComponent },
  {
    path: 'profile/:venueProfileId',
    component: VenueProfileDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: VenuesDashboardRoutes.DETAILS,
        pathMatch: 'full',
      },
      {
        path: VenuesDashboardRoutes.DETAILS,
        component: VenueProfileDetailsComponent,
      },
      {
        path: VenuesDashboardRoutes.MEDIA,
        component: ProfileMediaComponent,
      },
      {
        path: VenuesDashboardRoutes.BUSINESS_PROFILE,
        component: BusinessProfileComponent,
      },
      {
        path: VenuesDashboardRoutes.REVENUE_ACCOUNT,
        component: RevenueAccountComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VenuesDashboardRoutingModule {}
