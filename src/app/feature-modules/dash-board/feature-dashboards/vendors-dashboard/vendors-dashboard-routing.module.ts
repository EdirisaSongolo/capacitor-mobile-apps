import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorsDashboardMainComponent } from '@dash-board/feature-dashboards/vendors-dashboard';
import { VendorProfileDashboardComponent } from './vendor-profile-dashboard/vendor-profile-dashboard.component';
import { VendorsDashboardRoutes } from '@vendors-core/data-models';
import { VendorProfileDetailsComponent } from './display-components';
import { ProfileMediaComponent } from '@media-core/components';
import { BusinessProfileComponent } from '@profile-accounts-core/components';
import { RevenueAccountComponent } from '@profile-revenue-core/components';

const routes: Routes = [
  { path: '', component: VendorsDashboardMainComponent },
  {
    path: 'profile/:vendorProfileId',
    component: VendorProfileDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: VendorsDashboardRoutes.DETAILS,
        pathMatch: 'full',
      },
      {
        path: VendorsDashboardRoutes.DETAILS,
        component: VendorProfileDetailsComponent,
      },
      {
        path: VendorsDashboardRoutes.MEDIA,
        component: ProfileMediaComponent,
      },
      {
        path: VendorsDashboardRoutes.BUSINESS_PROFILE,
        component: BusinessProfileComponent,
      },
      {
        path: VendorsDashboardRoutes.REVENUE_ACCOUNT,
        component: RevenueAccountComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorsDashboardRoutingModule {}
