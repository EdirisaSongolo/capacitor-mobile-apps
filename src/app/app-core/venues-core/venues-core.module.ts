import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { VenueStoreModule } from '@venues-core/store/venues-store.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { MediaCoreModule } from '@app-core/media-core/media-core.module';

import {
  VenuePlacComponent,
  VenueProfileManagementComponent,
  VenueSearchComponent,
} from '@venues-core/components';

@NgModule({
  declarations: [
    VenuePlacComponent,
    VenueProfileManagementComponent,
    VenueSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    VenueStoreModule,
    UserProfileCoreModule,
    AppDomainModule,
    MediaCoreModule,
  ],
  exports: [
    VenuePlacComponent,
    VenueProfileManagementComponent,
    VenueSearchComponent,
  ],
})
export class VenuesCoreModule {}
