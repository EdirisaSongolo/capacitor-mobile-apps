import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from '@messaging/messaging/messaging.component';
import { MessagingRoutingModule } from '@messaging/messaging-routing.module';
import { MaterialImportsModules } from '@core-modules';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunicationsCoreModule } from '@communications-core/communications-core.module';
import { UserProfileCoreModule } from '@app-core/user-profile-core/user-profile-core.module';

import {
  ChatComponent,
  RecentMessageComponent,
} from '@messaging/display-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    TranslateModule,
    MessagingRoutingModule,
    CommunicationsCoreModule,
    UserProfileCoreModule,
  ],
  declarations: [MessagingComponent, RecentMessageComponent, ChatComponent],
})
export class MessagingModule {}
