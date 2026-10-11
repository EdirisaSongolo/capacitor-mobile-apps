import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileMediaComponent } from '@media-core/components';
import { ServiceProviderComponent } from '@profile-accounts-core/components';

import { VenueProfileComponent } from '@venue-profile/venue-profile/venue-profile.component';
import { VenueProfileManagementComponent } from '@venues-core/components';
import { VenuesRoutes } from '@venues-core/data-models';

const routes: Routes = [
  {
    path: '',
    component: VenueProfileComponent,
    children: [
      { path: '', redirectTo: VenuesRoutes.MEDIA, pathMatch: 'full' },
      { path: VenuesRoutes.MEDIA, component: ProfileMediaComponent },
      {
        path: VenuesRoutes.BUSINESS_PROFILE,
        component: ServiceProviderComponent,
      },
      {
        path: VenuesRoutes.MANAGEMENT,
        component: VenueProfileManagementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VenueProfileRoutingModule {}
