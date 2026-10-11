import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { MediaCoreModule } from '@media-core/media-core.module';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { VenuesCoreModule } from '@venues-core/venues-core.module';
import { ProfileRevenueCoreModule } from '@profile-revenue-core/profile-revenue-core.module';
import { VenueProfileRoutingModule } from '@venue-profile/venue-profile-routing.module';

import { VenueProfileComponent } from '@venue-profile/venue-profile/venue-profile.component';
import { VenueProfileHeaderComponent } from '@venue-profile/venue-profile-header/venue-profile-header.component';
import { ProfileAccountsCoreModule } from '@profile-accounts-core/profile-accounts-core.module';

@NgModule({
  declarations: [VenueProfileComponent, VenueProfileHeaderComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    VenuesCoreModule,
    ProfileRevenueCoreModule,
    MediaCoreModule,
    ProfileAccountsCoreModule,
    VenueProfileRoutingModule,
  ],
})
export class VenueProfileModule {}
