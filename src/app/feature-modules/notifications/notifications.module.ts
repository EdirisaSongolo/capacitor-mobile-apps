import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { CommunicationsCoreModule } from '@communications-core/communications-core.module';
import { MediaCoreModule } from '@app-core/media-core/media-core.module';
import { UserProfileCoreModule } from '@user-profile-core/user-profile-core.module';
import { PrivateEventsCoreModule } from '@private-events-core/private-events-core.module';
import { ProfileRevenueCoreModule } from '@profile-revenue-core/profile-revenue-core.module';
import { NotificationsRoutingModule } from '@notifications/notifications-routing.modules';

import { NotificationsComponent } from '@notifications/notifications/notifications.component';

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    MaterialImportsModules,
    TranslateModule,
    AppDomainModule,
    CommunicationsCoreModule,
    MediaCoreModule,
    UserProfileCoreModule,
    PrivateEventsCoreModule,
    ProfileRevenueCoreModule,
    NotificationsRoutingModule,
  ],
})
export class NotificationsModule {}
