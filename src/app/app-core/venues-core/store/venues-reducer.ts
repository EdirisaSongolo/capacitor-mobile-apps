import { createReducer, on } from '@ngrx/store';
import { VenueStore } from '@venues-core/store/constants';
import {
  storeUserManagedVenues,
  storeLocationVenues,
  retrieveVenueProfileManagers,
  storeVenueProfileManagers,
  storeVenueSearchResults,
  storeVenueToken,
  updateVenueProfileImage,
  setVenuesDetailsDisplay,
} from '@venues-core/store/venues-actions';

export const venueState: VenueStore = {
  detailsDisplay: null,
  locationVenues: [],
  managedVenues: [],
  venueSearch: [],
  venueToken: null,
  venueManagers: [],
};

export const venuesReducer = createReducer(
  venueState,
  on(setVenuesDetailsDisplay, (state, { detailsDisplay }) => ({
    ...state,
    detailsDisplay: detailsDisplay,
  })),
  on(storeLocationVenues, (state, { venues }) => ({
    ...state,
    locationVenues: venues,
  })),
  on(storeUserManagedVenues, (state, { managedVenues }) => ({
    ...state,
    managedVenues,
  })),
  on(storeVenueSearchResults, (state, { searchResults }) => ({
    ...state,
    venueSearch: [...searchResults],
  })),
  on(storeVenueToken, (state, { venue }) => ({ ...state, venueToken: venue })),
  on(updateVenueProfileImage, (state, { mediaFileUrl }) => ({
    ...state,
    venueToken: { ...state.venueToken, profileImage: mediaFileUrl },
  })),
  on(retrieveVenueProfileManagers, (state): VenueStore => ({
    ...state,
    venueManagers: [],
  })),
  on(storeVenueProfileManagers, (state, { venueManagers }) => ({
    ...state,
    venueManagers: venueManagers,
  }))
);
