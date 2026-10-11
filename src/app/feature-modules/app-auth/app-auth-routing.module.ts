import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginSingupComponent } from '@app-auth/login-singup/login-singup.component';

const routes: Routes = [{ path: '', component: LoginSingupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppAuthRoutingModule {}
