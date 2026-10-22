import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { OperationsComponent } from '@operations/operations/operations.component';
import { TicketScanComponent } from '@operations/display-components';

import { OperationsRoutes } from '@operations-core/data-models';

const routes: Routes = [
  {
    path: '',
    component: OperationsComponent,
    children: [
      { path: '', redirectTo: OperationsRoutes.TICKET_SCAN, pathMatch: 'full' },
      { path: OperationsRoutes.TICKET_SCAN, component: TicketScanComponent },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationsRoutingModule {}
