import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MEDIA } from '@media-core/store/constants';
import { mediaReducer } from '@media-core/store/media-reducer';
import { MediaEffects } from '@media-core/store/media-effects';

@NgModule({
  imports: [
    StoreModule.forFeature(MEDIA, mediaReducer),
    EffectsModule.forFeature([MediaEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class MediaStoreModule {}
