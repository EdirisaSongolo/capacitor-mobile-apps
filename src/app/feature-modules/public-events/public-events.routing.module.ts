import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicEventRoutes } from '@app-core/public-events-core/data-models';
import { AppHomeComponent } from '@public-events/public-events/public-events.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: PublicEventRoutes.PUBLIC_EVENTS,
    pathMatch: 'full',
  },
  {
    path: PublicEventRoutes.PUBLIC_EVENTS,
    component: AppHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicEventsRoutingModule {}
