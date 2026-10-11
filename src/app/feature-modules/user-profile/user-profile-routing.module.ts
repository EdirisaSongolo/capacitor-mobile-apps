import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UserProfileComponent } from '@user-profile/user-profile/user-profile.component';
import { UserSocialsComponent } from '@user-profile/display-components';
import { UserProfileRoutes } from '@user-profile-core/data-models';
import { ProfileMediaComponent } from '@media-core/components';
import { ServiceProviderComponent } from '@profile-accounts-core/components';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    children: [
      { path: '', redirectTo: UserProfileRoutes.MEDIA, pathMatch: 'full' },
      { path: UserProfileRoutes.USER_SOCIALS, component: UserSocialsComponent },
      { path: UserProfileRoutes.MEDIA, component: ProfileMediaComponent },
      {
        path: UserProfileRoutes.BUSINESS_PROFILE,
        component: ServiceProviderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileRoutingModule {}
