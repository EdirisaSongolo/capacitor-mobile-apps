import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';

import { CommunicationsStoreModule } from '@communications-core/store/communications-store.module';

import { EventPostsComponent } from '@communications-core/components';

@NgModule({
  declarations: [EventPostsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    CommunicationsStoreModule,
  ],
  exports: [EventPostsComponent],
})
export class CommunicationsCoreModule {}
