import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PROFILE_ACCOUNTS } from '@profile-accounts-core/store/constants';
import { profileAccountsReducer } from '@profile-accounts-core/store/profile-accounts-reducer';
import { ProfileAccountsEffects } from '@profile-accounts-core/store/profile-accounts-effects';

@NgModule({
  imports: [
    StoreModule.forFeature(PROFILE_ACCOUNTS, profileAccountsReducer),
    EffectsModule.forFeature([ProfileAccountsEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class ProfileAccountsStoreModule {}
