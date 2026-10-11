import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VENUES, VenueStore } from '@venues-core/store/constants';

export const venuesFeature = createFeatureSelector<VenueStore>(VENUES);

export const venuesDetailsSelector = createSelector(
  venuesFeature,
  state => state.detailsDisplay
);

export const locationVenuesSelector = createSelector(
  venuesFeature,
  state => state.locationVenues
);

export const managedVenuesSelector = createSelector(
  venuesFeature,
  state => state.managedVenues
);

export const venueSearchSelector = createSelector(
  venuesFeature,
  state => state.venueSearch
);

export const venueTokenSelector = createSelector(
  venuesFeature,
  state => state.venueToken
);

export const venueProfileManagementSelector = createSelector(
  venuesFeature,
  state => state.venueManagers
);
