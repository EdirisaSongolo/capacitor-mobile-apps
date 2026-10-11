import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileDashboardComponent } from '@user-profile-dashboard/user-profile-dashboard/user-profile-dashboard.component';
import { AccountSocialsComponent } from '@user-profile-core/components/account-socials/account-socials.component';
import { UserProfileDashboardRoutes } from '@user-profile-core/data-models';
import {
  UserPaymentMethodsComponent,
  UserProfileDetailsComponent,
  UserProfileInterestsComponent,
  UserProfilePasswordComponent,
} from '@user-profile-dashboard/display-components';
import { BusinessProfileComponent } from '@profile-accounts-core/components/business-profile';
import { RevenueAccountComponent } from '@profile-revenue-core/components/revenue-account';

const routes: Routes = [
  {
    path: '',
    component: UserProfileDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: UserProfileDashboardRoutes.DETAILS,
        pathMatch: 'full',
      },
      {
        path: UserProfileDashboardRoutes.DETAILS,
        component: UserProfileDetailsComponent,
      },
      {
        path: UserProfileDashboardRoutes.INTERESTS,
        component: UserProfileInterestsComponent,
      },
      {
        path: UserProfileDashboardRoutes.BUSINESS_PROFILE,
        component: BusinessProfileComponent,
      },
      {
        path: UserProfileDashboardRoutes.REVENUE_ACCOUNT,
        component: RevenueAccountComponent,
      },
      {
        path: UserProfileDashboardRoutes.PAYMENT_METHODS,
        component: UserPaymentMethodsComponent,
      },
      {
        path: UserProfileDashboardRoutes.PASSWORD,
        component: UserProfilePasswordComponent,
      },
    ],
  },
  { path: 'socials', component: AccountSocialsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileDashboardRoutingModule {}
