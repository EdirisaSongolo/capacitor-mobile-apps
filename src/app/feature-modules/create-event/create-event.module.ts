import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-domain/app-domain.module';

import { CreateEventRoutingModule } from '@create-event/create-event.routing.module';
import { PublicEventsCoreModule } from '@public-events-core/public-events-core.module';
import { PrivateEventsCoreModule } from '@private-events-core/private-events-core.module';
import { VenuesCoreModule } from '@app-core/venues-core/venues-core.module';
import { VendorsCoreModule } from '@vendors-core/vendors-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';

import { CreateEventControlsComponent } from '@create-event/index';
import { CreatePublicEventComponent } from '@create-public-event/create-public-event/create-public-event.component';
import {
  CategoryNameComponent,
  PosterDescriptionComponent,
  PublicEventPrincipalComponent,
  PreviewCompleteComponent,
} from '@create-public-event/display-components';

import { CreatePrivateEventComponent } from '@create-private-event/create-private-event/create-private-event.component';
import {
  NamePreviewComponent,
  PosterInvitationComponent,
  EventCompleteComponent,
} from '@create-private-event/display-components';

@NgModule({
  declarations: [
    CreateEventControlsComponent,
    CreatePublicEventComponent,
    CategoryNameComponent,
    PosterDescriptionComponent,
    PublicEventPrincipalComponent,
    PreviewCompleteComponent,
    CreatePrivateEventComponent,
    NamePreviewComponent,
    PosterInvitationComponent,
    EventCompleteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    CreateEventRoutingModule,
    PublicEventsCoreModule,
    PrivateEventsCoreModule,
    VenuesCoreModule,
    VendorsCoreModule,
    UserProfileCoreModule,
  ],
})
export class CreateEventModule {}
