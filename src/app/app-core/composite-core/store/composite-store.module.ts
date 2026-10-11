import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { COMPOSITE } from '@composite-core/store/constants';
import { compositeReducer } from '@composite-core/store/composite-reducer';
import { CompositeEffects } from '@composite-core/store/composite-effects';

@NgModule({
  imports: [
    StoreModule.forFeature(COMPOSITE, compositeReducer),
    EffectsModule.forFeature([CompositeEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class CompositeStoreModule {}
