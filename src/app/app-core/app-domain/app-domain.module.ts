import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainStoreModule } from '@app-domain/store/domain-store.module';

import {
  ConfirmationDialogComponent,
  CategoriesComponent,
} from '@app-core/app-domain/components';
import { CurrencyDisplayDirective } from '@app-domain/directives';
import {
  TuuskaInputComponent,
  TuuskaDateInputComponent,
  TuuskaTimeInputComponent,
  TuuskaLocationInputComponent,
} from '@app-domain/components/design-components';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    CategoriesComponent,
    CurrencyDisplayDirective,
    TuuskaInputComponent,
    TuuskaDateInputComponent,
    TuuskaTimeInputComponent,
    TuuskaLocationInputComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgxMaskDirective,
    MaterialImportsModules,
    AppDomainStoreModule,
  ],
  exports: [
    ConfirmationDialogComponent,
    CategoriesComponent,
    CurrencyDisplayDirective,
    TuuskaInputComponent,
    TuuskaDateInputComponent,
    TuuskaTimeInputComponent,
    TuuskaLocationInputComponent,
  ],
})
export class AppDomainModule {}
