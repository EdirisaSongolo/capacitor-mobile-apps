import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicEventRoutes } from '@public-events-core/data-models';

import { ProfileMediaComponent } from '@media-core/components';

import { PublicEventProfileComponent } from '@public-event-profile/public-event-profile/public-event-profile.component';
import {
  PublicEventProfileDateDetailsComponent,
  PublicEventProfileDatesComponent,
  PublicEventProfileFeaturesComponent,
  PublicEventProfileLocationsComponent,
} from '@public-event-profile/display-components';

const routes: Routes = [
  {
    path: '',
    component: PublicEventProfileComponent,
    children: [
      { path: '', redirectTo: PublicEventRoutes.MEDIA, pathMatch: 'full' },
      { path: PublicEventRoutes.MEDIA, component: ProfileMediaComponent },
      {
        path: PublicEventRoutes.DATES,
        component: PublicEventProfileDatesComponent,
      },
      {
        path: `${PublicEventRoutes.EVENT_DATE}/:${PublicEventRoutes.EVENT_DATE_ID}`,
        component: PublicEventProfileDateDetailsComponent,
      },
      {
        path: PublicEventRoutes.FEATURES,
        component: PublicEventProfileFeaturesComponent,
      },
      {
        path: PublicEventRoutes.LOCATIONS,
        component: PublicEventProfileLocationsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicEventProfileRoutingModule {}
