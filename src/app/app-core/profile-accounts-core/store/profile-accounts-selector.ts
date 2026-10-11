import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PROFILE_ACCOUNTS,
  ProfileAccountsStore,
} from '@profile-accounts-core/store/constants';

export const profileAccountsFeature =
  createFeatureSelector<ProfileAccountsStore>(PROFILE_ACCOUNTS);

export const managedProfilesSelector = createSelector(
  profileAccountsFeature,
  state => state.managedProfiles
);

export const businessProfileSelector = createSelector(
  profileAccountsFeature,
  state => state.businessProfile
);

export const serviceProvidersSelector = createSelector(
  profileAccountsFeature,
  state => state.serviceProviders
);

export const providerSearchResultsSelector = createSelector(
  profileAccountsFeature,
  state => state.providerSearchResults
);

export const serviceProviderSelector = createSelector(
  profileAccountsFeature,
  state => state.serviceProvider
);

export const userEventsSelector = createSelector(
  profileAccountsFeature,
  state => state?.userEvents
);

export const userEventSelector = createSelector(
  profileAccountsFeature,
  state => state.userEvent
);
