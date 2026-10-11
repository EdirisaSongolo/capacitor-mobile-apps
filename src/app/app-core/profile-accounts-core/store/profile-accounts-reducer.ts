import { createReducer, on } from '@ngrx/store';
import { ProfileAccountsStore } from '@profile-accounts-core/store/constants';
import {
  storeProviderServices,
  storeProviderSearchResults,
  storeServiceProvider,
  storeServiceProviders,
  storeBusinessProfile,
  storeManagedProfiles,
  storeUserEvents,
  setUserEvent,
  retrieveBusinessProfile,
} from '@profile-accounts-core/store/profile-accounts-actions';

export const profileAccountsState: ProfileAccountsStore = {
  managedProfiles: [],
  businessProfile: null,
  serviceProviders: [],
  providerSearchResults: [],
  serviceProvider: null,
  userEvents: [],
  userEvent: null,
};

export const profileAccountsReducer = createReducer(
  profileAccountsState,
  on(storeManagedProfiles, (state, { managedProfiles }) => ({
    ...state,
    managedProfiles: managedProfiles,
  })),
  on(retrieveBusinessProfile, (state): ProfileAccountsStore => ({
    ...state,
    businessProfile: null,
  })),
  on(storeBusinessProfile, (state, { businessProfile }) => ({
    ...state,
    businessProfile: businessProfile,
  })),
  on(storeProviderServices, (state, { profileServices }) => ({
    ...state,
    businessProfile: {
      ...state.businessProfile,
      services: profileServices,
    },
  })),
  on(storeServiceProviders, (state, { serviceProviders }) => ({
    ...state,
    serviceProviders: serviceProviders,
  })),
  on(storeProviderSearchResults, (state, { serviceProviders }) => ({
    ...state,
    providerSearchResults: serviceProviders,
  })),
  on(storeServiceProvider, (state, { serviceProvider }) => ({
    ...state,
    serviceProvider: serviceProvider,
  })),
  on(storeUserEvents, (state, { userEvents }) => ({
    ...state,
    userEvents: [...userEvents],
  })),
  on(setUserEvent, (state, { userEvent }) => ({
    ...state,
    userEvent: { ...userEvent },
  }))
);
