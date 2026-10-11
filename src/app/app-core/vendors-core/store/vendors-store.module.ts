import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { VENDORS } from '@vendors-core/store/constants';
import { VendorsEffects } from '@vendors-core/store/vendors-effects';
import { vendorsReducer } from '@vendors-core/store/vendors-reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(VENDORS, vendorsReducer),
    EffectsModule.forFeature([VendorsEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class VendorStoreModule {}
