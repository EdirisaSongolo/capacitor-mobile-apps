import { createAction, props } from '@ngrx/store';
import {
  DateTokenDTO,
  EventComponentDTO,
  EventDateProfileDTO,
  LocationTokenDTO,
  PublicEventTokenDTO,
  UserPublicEventDTO,
} from '@public-events-core/api';
import {
  LocationCategoriesDTO,
  ProfileDTO,
  SearchDTO,
} from '@app-core/app-api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { PaymentTransactionDTO } from '@profile-revenue-core/api';
import { DatesDisplay } from '@public-events-core/data-models';

export const RETRIEVE_USER_MANAGED_PUBLIC_EVENTS =
  '[Public Events Dashboard] Retrieve user managed public events';
export const retrieveUserManagedPublicEvents = createAction(
  RETRIEVE_USER_MANAGED_PUBLIC_EVENTS
);

export const RETRIEVE_PUBLIC_EVENTS = '[Public Events] Retrieve public events';
export const retrievePublicEvents = createAction(
  RETRIEVE_PUBLIC_EVENTS,
  props<{ locationCategories: LocationCategoriesDTO }>()
);

export const STORE_PUBLIC_EVENTS = '[Public Events] Store public events';
export const storePublicEvents = createAction(
  STORE_PUBLIC_EVENTS,
  props<{ publicEvents: PublicEventTokenDTO[] }>()
);

export const RETRIEVE_PUBLIC_EVENT_SEARCH_RESULTS =
  '[Public Events] Retrieve public event search results';
export const retrievePublicEventSearchResults = createAction(
  RETRIEVE_PUBLIC_EVENT_SEARCH_RESULTS,
  props<{ searchDTO: SearchDTO }>()
);

export const STORE_PUBLIC_EVENT_SEARCH_RESULTS =
  '[Public Events] Store public events search results';
export const storePublicEventSearchResults = createAction(
  STORE_PUBLIC_EVENT_SEARCH_RESULTS,
  props<{ publicEvents: PublicEventTokenDTO[] }>()
);

export const RETRIEVE_PUBLIC_EVENT_TOKEN =
  '[Public Event Core] Retrieve public event token';
export const retrievePublicEventToken = createAction(
  RETRIEVE_PUBLIC_EVENT_TOKEN,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_PUBLIC_EVENT_TOKEN =
  '[Public Event Core] Store public event token';
export const storePublicEventToken = createAction(
  STORE_PUBLIC_EVENT_TOKEN,
  props<{ publicEventToken: PublicEventTokenDTO }>()
);

export const SET_EVENT_COMPONENT =
  '[Public Event Dashboard] Set event component';
export const setEventComponent = createAction(
  SET_EVENT_COMPONENT,
  props<{ eventComponent: EventComponentDTO }>()
);

export const RETRIEVE_EVENT_LOCATIONS_TOKENS =
  '[Public Events] Retrieve event locations tokens';
export const retrieveEventLocationsTokens = createAction(
  RETRIEVE_EVENT_LOCATIONS_TOKENS,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_EVENT_LOCATIONS_TOKENS =
  '[Public Event Dashboard] Store event Locations tokens';
export const storeEventLocationsTokens = createAction(
  STORE_EVENT_LOCATIONS_TOKENS,
  props<{ locationsTokens: LocationTokenDTO[] }>()
);

export const SET_DATES_DISPLAY = '[Public Event Profile] Set dates display';
export const setDatesDisplay = createAction(
  SET_DATES_DISPLAY,
  props<{ datesDisplay: DatesDisplay }>()
);

export const RETRIEVE_EVENT_DATES_TOKENS =
  '[Public Events] Retrieve event dates tokens';
export const retrieveEventDatesTokens = createAction(
  RETRIEVE_EVENT_DATES_TOKENS,
  props<{ profile: ProfileDTO }>()
);

export const RETRIEVE_LOCATION_DATES_TOKENS =
  '[Public Event] Retrieve location dates tokens';
export const retrieveLocationDatesTokens = createAction(
  RETRIEVE_LOCATION_DATES_TOKENS,
  props<{ eventComponent: EventComponentDTO }>()
);

export const STORE_EVENT_DATES_TOKENS =
  '[Public Event Dashboard] Store event dates tokens';
export const storeEventDatesTokens = createAction(
  STORE_EVENT_DATES_TOKENS,
  props<{ dateTokens: DateTokenDTO[] }>()
);

export const RETRIEVE_EVENT_DATE_PROFILE =
  '[Public Event Profile] Retrieve event date profile';
export const retrieveEventDateProfile = createAction(
  RETRIEVE_EVENT_DATE_PROFILE,
  props<{ eventComponent: EventComponentDTO }>()
);

export const STORE_EVENT_DATE_PROFILE =
  '[Public Event Profile] Store event date profile';
export const storeEventDateProfile = createAction(
  STORE_EVENT_DATE_PROFILE,
  props<{ eventDateProfile: EventDateProfileDTO }>()
);

export const RETRIEVE_PUBLIC_EVENT_FEATURES =
  '[Public Event Profile] Retrieve public event features';
export const retrievePublicEventFeatures = createAction(
  RETRIEVE_PUBLIC_EVENT_FEATURES,
  props<{ profile: ProfileDTO }>()
);

export const STORE_PUBLIC_EVENT_FEATURES =
  '[Public Event Profile] Save public event features';
export const storePublicEventFeatures = createAction(
  STORE_PUBLIC_EVENT_FEATURES,
  props<{ eventFeatures: ServiceProviderDTO[] }>()
);

export const RETRIEVE_PUBLIC_EVENT_PRINCIPAL =
  '[Public Event Profile] Retrieve public event principal';
export const retrievePublicEventPrincipal = createAction(
  RETRIEVE_PUBLIC_EVENT_PRINCIPAL,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_PUBLIC_EVENT_PRINCIPAL =
  '[Public Event Profile] Store public event principal';
export const storePublicEventPrincipal = createAction(
  STORE_PUBLIC_EVENT_PRINCIPAL,
  props<{ eventPrincipal: ServiceProviderDTO }>()
);

export const SAVE_PUBLIC_EVENT_DATE =
  '[Public Event Profile] Save public event date';
export const savePublicEventDate = createAction(
  SAVE_PUBLIC_EVENT_DATE,
  props<{ eventDate: EventComponentDTO }>()
);

export const PURCHASE_PUBLIC_EVENT_TICKETS =
  '[Public Event Profile] Purchase public event tickets';
export const purchasePublicEventTickets = createAction(
  PURCHASE_PUBLIC_EVENT_TICKETS,
  props<{
    paymentTransaction: PaymentTransactionDTO;
    eventComponent: EventComponentDTO;
  }>()
);

export const RETRIEVE_DATE_EVENT_TOKEN =
  '[User Account] Retrieve date event token';
export const retrieveDateEventToken = createAction(
  RETRIEVE_DATE_EVENT_TOKEN,
  props<{ eventComponent: EventComponentDTO }>()
);

export const RETRIEVE_USER_PUBLIC_EVENT =
  '[User Account] Retrieve user public event';
export const retrieveUserPublicEvent = createAction(
  RETRIEVE_USER_PUBLIC_EVENT,
  props<{ eventComponent: EventComponentDTO }>()
);

export const STORE_USER_PUBLIC_EVENT = '[User Account] Store user public event';
export const storeUserPublicEvent = createAction(
  STORE_USER_PUBLIC_EVENT,
  props<{ userPublicEvent: UserPublicEventDTO }>()
);
