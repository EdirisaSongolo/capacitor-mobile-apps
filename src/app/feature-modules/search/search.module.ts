import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SearchRoutingModule } from '@search/search-routing.module';
import { MaterialImportsModules } from '@core-modules';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { VenuesCoreModule } from '@venues-core/venues-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';
import { PublicEventsCoreModule } from '@public-events-core/public-events-core.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { CompositeStoreModule } from '@composite-core/store/composite-store.module';

import { SearchComponent } from '@search/search/search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SearchRoutingModule,
    MaterialImportsModules,
    UserProfileCoreModule,
    VenuesCoreModule,
    VendorsCoreModule,
    PublicEventsCoreModule,
    AppDomainModule,
    CompositeStoreModule,
  ],
})
export class SearchModule {}
