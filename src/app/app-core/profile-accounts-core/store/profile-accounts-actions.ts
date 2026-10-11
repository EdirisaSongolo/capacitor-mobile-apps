import {
  LocationCategoriesDTO,
  ProfileDTO,
  SearchDTO,
  UserEventDTO,
} from '@app-core/app-api';
import { createAction, props } from '@ngrx/store';
import {
  BusinessProfileDTO,
  ProviderServiceDTO,
  ServiceProviderDTO,
} from '@profile-accounts-core/api';

export const RETRIEVE_MANAGED_PROFILES =
  '[Dashboard] Retrieve managed profiles';
export const retrieveManagedProfiles = createAction(RETRIEVE_MANAGED_PROFILES);

export const STORE_MANAGED_PROFILES =
  '[Profile Accounts Core] Store managed profiles';
export const storeManagedProfiles = createAction(
  STORE_MANAGED_PROFILES,
  props<{ managedProfiles: ServiceProviderDTO[] }>()
);

export const REGISTER_BUSINESS_PROFILE =
  '[Profile Accounts Core] Register business profile';
export const registerBusinessProfile = createAction(
  REGISTER_BUSINESS_PROFILE,
  props<{ profileDTO: ProfileDTO }>()
);

export const DISABLE_BUSINESS_PROFILE =
  '[Profile Accounts Core] Disable business profile';
export const disableServiceProvider = createAction(
  DISABLE_BUSINESS_PROFILE,
  props<{ profileDTO: ProfileDTO }>()
);

export const RETRIEVE_BUSINESS_PROFILE =
  '[Profile Accounts Core] Retrieve business profile';
export const retrieveBusinessProfile = createAction(
  RETRIEVE_BUSINESS_PROFILE,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_BUSINESS_PROFILE =
  '[Profile Accounts Core] Store business profile';
export const storeBusinessProfile = createAction(
  STORE_BUSINESS_PROFILE,
  props<{ businessProfile: BusinessProfileDTO }>()
);

export const UPDATE_BUSINESS_PROFILE_CATEGORY =
  '[Profile Accounts Core] Update business profile category';
export const updateBusinessProfileCategory = createAction(
  UPDATE_BUSINESS_PROFILE_CATEGORY,
  props<{ businessProfile: BusinessProfileDTO }>()
);

export const UPDATE_BUSINESS_PROFILE_BASE_RATE =
  '[Profile Accounts Core] Update business profile base rate';
export const updateBusinessProfileBaseRate = createAction(
  UPDATE_BUSINESS_PROFILE_BASE_RATE,
  props<{ businessProfile: BusinessProfileDTO }>()
);

export const CREATE_PROVIDER_SERVICE =
  '[Profile Accounts Core] Create service provider service';
export const createProviderService = createAction(
  CREATE_PROVIDER_SERVICE,
  props<{ providerService: ProviderServiceDTO }>()
);

export const UPDATE_PROVIDER_SERVICE =
  '[Profile Accounts Core] Update service provider service';
export const updateProviderService = createAction(
  UPDATE_PROVIDER_SERVICE,
  props<{ providerService: ProviderServiceDTO }>()
);

export const DELETE_PROVIDER_SERVICE =
  '[Profile Accounts Core] Delete service provider service';
export const deleteProviderService = createAction(
  DELETE_PROVIDER_SERVICE,
  props<{ providerService: ProviderServiceDTO }>()
);

export const STORE_PROVIDER_SERVICES =
  '[Profile Accounts Core] Store service provider services';
export const storeProviderServices = createAction(
  STORE_PROVIDER_SERVICES,
  props<{ profileServices: ProviderServiceDTO[] }>()
);

export const RETRIEVE_SERVICE_PROVIDERS: string =
  '[Service Providers] Retrieve service providers';
export const retrieveServiceProviders = createAction(
  RETRIEVE_SERVICE_PROVIDERS,
  props<{
    locationCategories: LocationCategoriesDTO;
  }>()
);

export const RETRIEVE_FEATURE_SERVICE_PROVIDERS =
  '[Public Events Core] Retrieve feature service providers';
export const retrieveFeatureServiceProviders = createAction(
  RETRIEVE_FEATURE_SERVICE_PROVIDERS,
  props<{ locationCategories: LocationCategoriesDTO }>()
);

export const RETRIEVE_STAFF_SERVICE_PROVIDERS =
  '[Public Events Core] Retrieve staff service providers';
export const retrieveStaffServiceProviders = createAction(
  RETRIEVE_STAFF_SERVICE_PROVIDERS,
  props<{ locationCategories: LocationCategoriesDTO }>()
);

export const STORE_SERVICE_PROVIDERS: string =
  '[Service Providers] Store service providers';
export const storeServiceProviders = createAction(
  STORE_SERVICE_PROVIDERS,
  props<{ serviceProviders: ServiceProviderDTO[] }>()
);

export const RETRIEVE_PROVIDER_SEARCH_RESULTS: string =
  '[Service Providers] Retrieve providers search results';
export const retrieveProviderSearchResults = createAction(
  RETRIEVE_PROVIDER_SEARCH_RESULTS,
  props<{ searchDTO: SearchDTO }>()
);

export const STORE_PROVIDER_SEARCH_RESULTS: string =
  '[Service Providers] Store provider search results';
export const storeProviderSearchResults = createAction(
  STORE_PROVIDER_SEARCH_RESULTS,
  props<{ serviceProviders: ServiceProviderDTO[] }>()
);

export const RETRIEVE_SERVICE_PROVIDER =
  '[Profile Accounts Core] Retrieve service provider';
export const retrieveServiceProvider = createAction(
  RETRIEVE_SERVICE_PROVIDER,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_SERVICE_PROVIDER =
  '[Profile Accounts Core] Store service provider';
export const storeServiceProvider = createAction(
  STORE_SERVICE_PROVIDER,
  props<{ serviceProvider: ServiceProviderDTO }>()
);

export const RETRIEVE_USER_EVENTS =
  '[User Account] Retrieve user account events';
export const retrieveUserEvents = createAction(RETRIEVE_USER_EVENTS);

export const STORE_USER_EVENTS = '[User Account] Store user events';
export const storeUserEvents = createAction(
  STORE_USER_EVENTS,
  props<{ userEvents: UserEventDTO[] }>()
);

export const SET_USER_EVENT = '[User Account] Set user Event';
export const setUserEvent = createAction(
  SET_USER_EVENT,
  props<{ userEvent: UserEventDTO }>()
);
