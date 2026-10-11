import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialImportsModules } from '@core-modules';
import { MediaCoreModule } from '@app-core/media-core/media-core.module';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';

import {
  UserProfilePlacComponent,
  UserSearchComponent,
  AccountSocialsComponent,
} from '@user-profile-core/components';
import { UserProfileStoreModule } from '@user-profile-core/store/user-profile-store.module';

@NgModule({
  declarations: [
    UserProfilePlacComponent,
    UserSearchComponent,
    AccountSocialsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    UserProfileStoreModule,
    MediaCoreModule,
    AppDomainModule,
  ],
  exports: [
    UserProfilePlacComponent,
    UserSearchComponent,
    AccountSocialsComponent,
  ],
})
export class UserProfileCoreModule {}
