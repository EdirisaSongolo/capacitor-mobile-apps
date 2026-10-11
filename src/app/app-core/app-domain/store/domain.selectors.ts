import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APP_DOMAIN, AppDomainStore } from './constants';

export const appDomainFeature =
  createFeatureSelector<AppDomainStore>(APP_DOMAIN);

export const profileDTOSelector = createSelector(
  appDomainFeature,
  appDomain => appDomain.profileDTO
);

export const componentActionSelector = createSelector(
  appDomainFeature,
  appDomain => appDomain.componentAction
);

export const componentResourceSelector = createSelector(
  appDomainFeature,
  appDomain => appDomain.componentResource
);
