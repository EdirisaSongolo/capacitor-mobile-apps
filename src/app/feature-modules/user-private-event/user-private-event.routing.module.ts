import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserPrivateEventComponent } from '@user-private-event/user-private-event/user-private-event.component';

const routes: Routes = [{ path: '', component: UserPrivateEventComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPrivateEventRoutingModule {}
