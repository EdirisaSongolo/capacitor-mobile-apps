import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserPublicEventComponent } from '@user-public-event/user-public-event/user-public-event.component';
import {
  DateFeaturesComponent,
  UserTicketsComponent,
} from '@user-public-event/display-components';
import { ProfileMediaComponent } from '@media-core/components';
import { UserPublicEventRoutes } from '@public-events-core/data-models';
import { EventPostsComponent } from '@communications-core/components';

const routes: Routes = [
  {
    path: '',
    component: UserPublicEventComponent,
    children: [
      { path: '', redirectTo: UserPublicEventRoutes.MEDIA, pathMatch: 'full' },
      { path: UserPublicEventRoutes.MEDIA, component: ProfileMediaComponent },
      {
        path: UserPublicEventRoutes.USER_TICKETS,
        component: UserTicketsComponent,
      },
      {
        path: UserPublicEventRoutes.EVENT_POSTS,
        component: EventPostsComponent,
      },
      {
        path: UserPublicEventRoutes.FEATURES,
        component: DateFeaturesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPublicEventRoutingModule {}
