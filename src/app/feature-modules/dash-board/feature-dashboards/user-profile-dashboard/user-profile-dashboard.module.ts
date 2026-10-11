import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { UserProfileDashboardRoutingModule } from '@user-profile-dashboard/user-profile-dashboard-routing.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { ProfileRevenueCoreModule } from '@app-core/profile-revenue-core/profile-revenue-core.module';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';

import { UserProfileDashboardComponent } from '@user-profile-dashboard/user-profile-dashboard/user-profile-dashboard.component';
import {
  UserProfileDetailsComponent,
  UserProfileInterestsComponent,
  UserPaymentMethodsComponent,
  UserProfilePasswordComponent,
} from '@user-profile-dashboard/display-components';

@NgModule({
  declarations: [
    UserProfileDashboardComponent,
    UserProfileDetailsComponent,
    UserProfileInterestsComponent,
    UserProfilePasswordComponent,
    UserPaymentMethodsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    AppDomainModule,
    UserProfileDashboardRoutingModule,
    ProfileAccountsCoreModule,
    UserProfileCoreModule,
    ProfileRevenueCoreModule,
    NgxMaskDirective,
  ],
})
export class UserProfileDashboardModule {}
