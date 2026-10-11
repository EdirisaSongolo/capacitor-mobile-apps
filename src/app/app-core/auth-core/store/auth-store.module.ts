import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from '@auth-core/store/auth.effects';

@NgModule({
  imports: [EffectsModule.forFeature([AuthEffects])],
  exports: [EffectsModule],
})
export class AuthStoreModule {}
