import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePublicEventComponent } from '@create-public-event/index';
import { CreatePrivateEventComponent } from '@create-private-event/index';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'public-event',
    pathMatch: 'full',
  },
  {
    path: 'public-event',
    component: CreatePublicEventComponent,
  },
  {
    path: 'private-event',
    component: CreatePrivateEventComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
class CreateEventRoutingModule {}

export { CreateEventRoutingModule };
