import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {
  MediaFilePlacComponent,
  ProfileMediaComponent,
} from '@media-core/components';
import { MaterialImportsModules } from '@core-modules';
import { AppDomainModule } from '@app-core/app-domain/app-domain.module';
import { MediaStoreModule } from '@media-core/store/media-store.module';

@NgModule({
  declarations: [MediaFilePlacComponent, ProfileMediaComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialImportsModules,
    AppDomainModule,
    MediaStoreModule,
  ],
  exports: [MediaFilePlacComponent, ProfileMediaComponent],
})
export class MediaCoreModule {}
