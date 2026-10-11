import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserPublicEventComponent } from '@user-public-event/user-public-event/user-public-event.component';

const routes: Routes = [{ path: '', component: UserPublicEventComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPublicEventRoutingModule {}
