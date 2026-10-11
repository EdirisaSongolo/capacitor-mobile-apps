import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaCoreModule } from '@media-core/media-core.module';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { VenuesRoutingModule } from '@venues/venues.routing.module';
import { VenuesCoreModule } from '@venues-core/venues-core.module';
import { ProfileRevenueCoreModule } from '@profile-revenue-core/profile-revenue-core.module';
import { VenuesComponent } from '@venues/venues/venues.component';

@NgModule({
  declarations: [VenuesComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    VenuesRoutingModule,
    AppDomainModule,
    VenuesCoreModule,
    ProfileRevenueCoreModule,
    MediaCoreModule,
  ],
})
export class VenuesModule {}
