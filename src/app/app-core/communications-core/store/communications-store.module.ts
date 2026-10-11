import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { communicationsReducer } from '@communications-core/store/communications.reducer';
import { CommunicationsEffects } from './communications.effects';
import { COMMUNICATIONS } from './constants';

@NgModule({
  imports: [
    StoreModule.forFeature(COMMUNICATIONS, communicationsReducer),
    EffectsModule.forFeature([CommunicationsEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class CommunicationsStoreModule {}
