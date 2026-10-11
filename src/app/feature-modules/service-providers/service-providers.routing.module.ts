import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceProvidersComponent } from '@service-providers/service-providers/service-providers.component';

const routes: Routes = [{ path: '', component: ServiceProvidersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceProvidersRoutingModule {}
