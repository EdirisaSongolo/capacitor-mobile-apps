import {
  LocationCategoriesDTO,
  ProfileDTO,
  SearchDTO,
} from '@app-core/app-api/app-api.dto-models';
import { VenueTokenDTO, VenueManagerDTO } from '@venues-core/api';
import { createAction, props } from '@ngrx/store';
import { DetailsDisplay } from '@venues-core/data-models';

export const SET_VENUES_DETAILS_DISPLAY =
  '[Venue Dashboard] Set venue dashboard details display';
export const setVenuesDetailsDisplay = createAction(
  SET_VENUES_DETAILS_DISPLAY,
  props<{ detailsDisplay: DetailsDisplay }>()
);

export const CREATE_VENUE_PROFILE = '[Venue Dashboard] Create venue profile';
export const createVenueProfile = createAction(
  CREATE_VENUE_PROFILE,
  props<{ venueDTO: VenueTokenDTO }>()
);

export const UPDATE_VENUE_PROFILE_DETAILS =
  '[Venue Dashboard] Update venue profile details';
export const updateVenueProfileDetails = createAction(
  UPDATE_VENUE_PROFILE_DETAILS,
  props<{ venueDTO: VenueTokenDTO }>()
);

export const RETRIEVE_VENUE_TOKEN: string =
  '[Venue Profile] Retrieve venue Token';
export const retrieveVenueToken = createAction(
  RETRIEVE_VENUE_TOKEN,
  props<{ profile: ProfileDTO }>()
);

export const STORE_VENUE_TOKEN: string = '[Venues] Store venue Token DTO';
export const storeVenueToken = createAction(
  STORE_VENUE_TOKEN,
  props<{ venue: VenueTokenDTO }>()
);

export const RETRIEVE_LOCATION_VENUES =
  '[Venues] Retrieve current location venues';
export const retrieveLocationVenues = createAction(
  RETRIEVE_LOCATION_VENUES,
  props<{ locationCategories: LocationCategoriesDTO }>()
);

export const STORE_LOCATION_VENUES = '[Venues] Store current location venues';
export const storeLocationVenues = createAction(
  STORE_LOCATION_VENUES,
  props<{ venues: VenueTokenDTO[] }>()
);

export const RETRIEVE_USER_MANAGED_VENUES =
  '[Venue Dashboard] Retrieve User Managed Venues';
export const retrieveUserManagedVenues = createAction(
  RETRIEVE_USER_MANAGED_VENUES
);

export const STORE_USER_MANAGED_VENUES =
  '[Venue Dashboard] Store User Managed Venues';
export const storeUserManagedVenues = createAction(
  STORE_USER_MANAGED_VENUES,
  props<{ managedVenues: any[] }>()
);

export const CREATE_VENUE_PROFILE_MANAGER =
  '[Venue Core] Create venue profile manager';
export const createVenueProfileManager = createAction(
  CREATE_VENUE_PROFILE_MANAGER,
  props<{ venueManager: VenueManagerDTO }>()
);

export const RETRIEVE_VENUE_PROFILE_MANAGERS =
  '[Venue Core] Retrieve venue profile managers';
export const retrieveVenueProfileManagers = createAction(
  RETRIEVE_VENUE_PROFILE_MANAGERS,
  props<{ profile: ProfileDTO }>()
);

export const REMOVE_VENUE_PROFILE_MANAGERS =
  '[Venue Core] Remove venue profile managers';
export const removeVenueProfileManagers = createAction(
  REMOVE_VENUE_PROFILE_MANAGERS,
  props<{ venueManagers: VenueManagerDTO[] }>()
);

export const STORE_VENUE_PROFILE_MANAGERS =
  '[venueToken] Store venue profile managers';
export const storeVenueProfileManagers = createAction(
  STORE_VENUE_PROFILE_MANAGERS,
  props<{ venueManagers: VenueManagerDTO[] }>()
);

export const RETRIEVE_VENUE_SEARCH_RESULTS =
  '[Venues Core] Retrieve venue search results';
export const retrieveVenueSearchResults = createAction(
  RETRIEVE_VENUE_SEARCH_RESULTS,
  props<{ searchParam: SearchDTO }>()
);

export const STORE_VENUE_SEARCH_RESULTS =
  '[Venues Core] Store venue search results';
export const storeVenueSearchResults = createAction(
  STORE_VENUE_SEARCH_RESULTS,
  props<{ searchResults: VenueTokenDTO[] }>()
);

// called by the api response service to pass the updated image url to venue store
export const UPDATE_VENUE_PROFILE_IMAGE =
  '[Venue Dashboard] Update venue profile image';
export const updateVenueProfileImage = createAction(
  UPDATE_VENUE_PROFILE_IMAGE,
  props<{ mediaFileUrl: string }>()
);
