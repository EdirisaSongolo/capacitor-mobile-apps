import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { VENUES } from '@venues-core/store/constants';
import { VenuesEffects } from '@venues-core/store/venues-effects';
import { venuesReducer } from '@venues-core/store/venues-reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(VENUES, venuesReducer),
    EffectsModule.forFeature([VenuesEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class VenueStoreModule {}
