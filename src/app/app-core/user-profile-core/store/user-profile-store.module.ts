import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { USER_PROFILES } from '@app-core/user-profile-core/store/constants';
import { userProfileReducer } from '@user-profile-core/store/user-profile-reducer';
import { UserProfileDashboardEffects } from '@user-profile-core/store/user-profile-effects';

@NgModule({
  imports: [
    StoreModule.forFeature(USER_PROFILES, userProfileReducer),
    EffectsModule.forFeature([UserProfileDashboardEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class UserProfileStoreModule {}
