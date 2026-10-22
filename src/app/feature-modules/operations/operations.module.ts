import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-domain/app-domain.module';
import { OperationsRoutingModule } from '@operations/operations.routing.module';
import { OperationsCoreModule } from '@operations-core/operations-core.module';

import { OperationsComponent } from '@operations/operations/operations.component';
import { TicketScanComponent } from '@operations/display-components';
import { PublicEventsCoreModule } from '@public-events-core/public-events-core.module';

@NgModule({
  declarations: [OperationsComponent, TicketScanComponent],
  imports: [
    CommonModule,
    ZXingScannerModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    OperationsRoutingModule,
    OperationsCoreModule,
    PublicEventsCoreModule,
  ],
})
export class OperationsModule {}
