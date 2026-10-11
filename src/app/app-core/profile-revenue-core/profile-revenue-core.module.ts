import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { ProfileRevenueStoreModule } from '@profile-revenue-core/store/profile-revenue.store.module';

import { RevenueAccountComponent } from '@profile-revenue-core/components/revenue-account';
import { ConnectedAccountComponent } from '@profile-revenue-core/components/revenue-account/display-components';
import {
  BusinessDocumentsComponent,
  ManagingProfileComponent,
  IdentityVerificationComponent,
  BusinessContactsComponent,
} from '@profile-revenue-core/components/revenue-account/display-components/business-documents';

import {
  ProfileBookingPlacComponent,
  BookingInvoicePlacComponent,
} from '@profile-revenue-core/components/placs';

import {
  PaymentAuthorisationComponent,
  PaymentMethodsComponent,
} from '@profile-revenue-core/components/transactions';

@NgModule({
  declarations: [
    RevenueAccountComponent,
    BusinessDocumentsComponent,
    ConnectedAccountComponent,
    ProfileBookingPlacComponent,
    BookingInvoicePlacComponent,
    PaymentAuthorisationComponent,
    PaymentMethodsComponent,
    ManagingProfileComponent,
    IdentityVerificationComponent,
    BusinessContactsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    ProfileRevenueStoreModule,
    NgxMaskDirective,
  ],
  exports: [
    RevenueAccountComponent,
    BusinessDocumentsComponent,
    ManagingProfileComponent,
    ConnectedAccountComponent,
    ProfileBookingPlacComponent,
    BookingInvoicePlacComponent,
    PaymentAuthorisationComponent,
    PaymentMethodsComponent,
  ],
})
export class ProfileRevenueCoreModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'visa-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/credit-card-icons/visa.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'mastercard-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/credit-card-icons/mastercard.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'amex-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/credit-card-icons/amex.svg'
      )
    );

    this.iconRegistry.addSvgIcon(
      'discover-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/credit-card-icons/discover.svg'
      )
    );
  }
}
