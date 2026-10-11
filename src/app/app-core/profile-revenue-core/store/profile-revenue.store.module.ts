import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PROFILE_REVENUE } from '@profile-revenue-core/store/constants';
import { ProfileRevenueEffects } from '@profile-revenue-core/store/profile-revenue.effects';
import { profileRevenueReducer } from '@profile-revenue-core/store/profile-revenue.reducer';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(PROFILE_REVENUE, profileRevenueReducer),
    EffectsModule.forFeature([ProfileRevenueEffects]),
  ],
})
export class ProfileRevenueStoreModule {}
