import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { APP_DOMAIN } from './constants';
import { appDomainReducer } from '@app-domain/store/domain.reducer';

@NgModule({
  imports: [StoreModule.forFeature(APP_DOMAIN, appDomainReducer)],
  exports: [StoreModule],
})
export class AppDomainStoreModule {}
