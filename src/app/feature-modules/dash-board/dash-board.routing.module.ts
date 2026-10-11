import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashBoardComponent } from '@dash-board/dash-board/dash-board.component';
import {
  DashBoardAppsComponent,
  ProfileManagementComponent,
} from '@dash-board/display-components';

const routes: Routes = [
  {
    path: '',
    component: DashBoardComponent,
    children: [
      { path: '', redirectTo: 'user-profile', pathMatch: 'full' },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('@user-profile-dashboard/user-profile-dashboard.module').then(
            mod => mod.UserProfileDashboardModule
          ),
      },
      {
        path: 'apps',
        component: DashBoardAppsComponent,
      },
      {
        path: 'venues',
        loadChildren: () =>
          import('@venues-dashboard/venues-dashboard.module').then(
            mod => mod.VenuesDashboardModule
          ),
      },
      {
        path: 'vendors',
        loadChildren: () =>
          import('@vendors-dashboard/vendors-dashboard.module').then(
            mod => mod.VendorsDashboardModule
          ),
      },
      {
        path: 'public-events',
        loadChildren: () =>
          import('@public-events-dashboard/public-events-dashboard.module').then(
            mod => mod.PublicEventsDashboardModule
          ),
      },
      {
        path: 'private-events',
        loadChildren: () =>
          import('@private-events-dashboard/private-events-dashboard.module').then(
            mod => mod.PrivateEventsDashboardModule
          ),
      },
      {
        path: 'profile-management',
        component: ProfileManagementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashBoardRoutingModule {}
