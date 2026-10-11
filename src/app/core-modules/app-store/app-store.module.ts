import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import {
  appResponseReducer,
  authenticationStatusReducer,
  userLocationReducer,
  userProfileInfoReducer,
} from '@app-store/app.reducers';
import { ApplicationEffects } from '@app-store/app.effects';
import { clearStateOnLogout } from '@app-store/app.meta-reducers';
import { AppStore } from '@app-store/constants';

export const applicationReducers: ActionReducerMap<AppStore, any> = {
  authenticationStatus: authenticationStatusReducer,
  userProfileInfo: userProfileInfoReducer,
  appResponse: appResponseReducer,
  userLocation: userLocationReducer,
};

@NgModule({
  imports: [
    StoreModule.forRoot(applicationReducers, {
      metaReducers: [clearStateOnLogout],
    }),
    EffectsModule.forRoot([ApplicationEffects]),
  ],
  exports: [StoreModule, EffectsModule],
})
export class AppStoreModule {}
