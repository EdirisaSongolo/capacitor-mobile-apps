import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileMediaComponent } from '@media-core/components';
import { ServiceProviderComponent } from '@profile-accounts-core/components';
import { VendorProfileComponent } from '@vendor-profile/vendor-profile/vendor-profile.component';
import { VendorProfileManagementComponent } from '@vendors-core/components';
import { VendorsRoutes } from '@vendors-core/data-models';

const routes: Routes = [
  {
    path: '',
    component: VendorProfileComponent,
    children: [
      { path: '', redirectTo: VendorsRoutes.MEDIA, pathMatch: 'full' },
      { path: VendorsRoutes.MEDIA, component: ProfileMediaComponent },
      {
        path: VendorsRoutes.BUSINESS_PROFILE,
        component: ServiceProviderComponent,
      },
      {
        path: VendorsRoutes.MANAGEMENT,
        component: VendorProfileManagementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorProfileRoutingModule {}
