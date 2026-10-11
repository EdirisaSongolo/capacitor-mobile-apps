import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { PublicEventsRoutingModule } from '@public-events/public-events.routing.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { PublicEventsCoreModule } from '@public-events-core/public-events-core.module';

import { AppHomeComponent } from '@public-events/public-events/public-events.component';

@NgModule({
  declarations: [AppHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    PublicEventsRoutingModule,
    AppDomainModule,
    PublicEventsCoreModule,
  ],
})
export class PublicEventsModule {}
