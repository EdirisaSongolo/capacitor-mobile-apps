import {
  CreateEventControl,
  CreatePublicEventPanel,
  PublicEventAction,
  LocationAction,
  LocationDateAction,
  LocationsDisplay,
  EventStaffDisplay,
} from '@public-events-core/data-models';
import { createAction, props } from '@ngrx/store';
import {
  CreateEventDateDTO,
  CreateEventLocationDTO,
  CreatePublicEvent,
  EventComponentDTO,
  EventProviderDTO,
  PublicEventDateDTO,
  EventDetailsDTO,
  PublicEventLocationDTO,
  PublicEventPrincipalDTO,
  DateDetailsDTO,
  DateTokenDTO,
} from '@app-core/public-events-core/api';
import { ProviderRequestDTO, ProfileDTO } from '@app-core/app-api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';

export const SET_PUBLIC_EVENT_ACTION =
  '[Event Creation and Dashboard] Set event creation action';
export const setPublicEventAction = createAction(
  SET_PUBLIC_EVENT_ACTION,
  props<{ publicEventAction: PublicEventAction }>()
);

export const SET_LOCATION_ACTION =
  '[Event Creation and Dashboard] Set location action';
export const setLocationAction = createAction(
  SET_LOCATION_ACTION,
  props<{ locationAction: LocationAction }>()
);

export const SET_LOCATION_DATE_ACTION =
  '[Event Creation and Dashboard] Set location date action';
export const setLocationDateAction = createAction(
  SET_LOCATION_DATE_ACTION,
  props<{ locationDateAction: LocationDateAction }>()
);

export const SET_PUBLIC_EVENT_CONTROL =
  '[Create Public Event] Set public event control';
export const setPublicEventControl = createAction(
  SET_PUBLIC_EVENT_CONTROL,
  props<{ control: CreateEventControl }>()
);

export const SET_LOCATIONS_DISPLAY =
  '[Event Creation and Dashboard] Set locations display';
export const setLocationsDisplay = createAction(
  SET_LOCATIONS_DISPLAY,
  props<{ locationsDisplay: LocationsDisplay }>()
);

export const SET_EVENT_STAFF_DISPLAY =
  '[Event Creation and Dashboard] Set staff display';
export const setEventStaffDisplay = createAction(
  SET_EVENT_STAFF_DISPLAY,
  props<{ staffDisplay: EventStaffDisplay }>()
);

export const SET_PUBLIC_EVENT_DISPLAY_PANEL =
  '[Create Public Event] Set public event panel display component';
export const setPublicEventDisplayPanel = createAction(
  SET_PUBLIC_EVENT_DISPLAY_PANEL,
  props<{ displayPanel: CreatePublicEventPanel }>()
);

export const SET_EVENT_ID = '[Public Event Core] Set event id';
export const setEventId = createAction(
  SET_EVENT_ID,
  props<{ eventId: string }>()
);

export const SET_PUBLIC_EVENT_CATEGORY =
  '[Create Public Event] Set public event category';
export const setPublicEventCategory = createAction(
  SET_PUBLIC_EVENT_CATEGORY,
  props<{ eventCategory: string }>()
);

export const SET_PUBLIC_EVENT_PROFILE_IMAGE =
  '[Create Public Event] Set public event profile image';
export const setPublicEventProfileImage = createAction(
  SET_PUBLIC_EVENT_PROFILE_IMAGE,
  props<{
    profileImage: File | string;
  }>()
);

export const SET_PUBLIC_EVENT_NAME =
  '[Create Public Event] Set public event name';
export const setPublicEventName = createAction(
  SET_PUBLIC_EVENT_NAME,
  props<{
    eventName: string;
  }>()
);

export const UPDATE_PUBLIC_EVENT_MEDIA =
  '[Create Public Event] Update public event media';
export const updatePublicEventMedia = createAction(
  UPDATE_PUBLIC_EVENT_MEDIA,
  props<{ eventMedia: File[] }>()
);

export const SET_PUBLIC_EVENT_DESCRIPTION =
  '[Create Public Event] Set public event description';
export const setPublicEventDescription = createAction(
  SET_PUBLIC_EVENT_DESCRIPTION,
  props<{ eventDescription: string }>()
);

export const UPDATE_EVENT_LOCATIONS =
  '[public Event Core] Update public event locations';
export const updateEventLocations = createAction(
  UPDATE_EVENT_LOCATIONS,
  props<{ eventLocations: PublicEventLocationDTO[] }>()
);

export const SET_PUBLIC_EVENT_LOCATION =
  '[Public Event Core] Set public event location';
export const setPublicEventLocation = createAction(
  SET_PUBLIC_EVENT_LOCATION,
  props<{ publicEventLocation: PublicEventLocationDTO }>()
);

export const SET_PUBLIC_EVENT_DATE =
  '[Public Events Core] Set public event date';
export const setPublicEventDate = createAction(
  SET_PUBLIC_EVENT_DATE,
  props<{ publicEventDate: PublicEventDateDTO }>()
);

export const UPDATE_LOCATION_DATES =
  '[Public Events Core] Update location dates';
export const updateLocationDates = createAction(
  UPDATE_LOCATION_DATES,
  props<{ locationDates: PublicEventDateDTO[] }>()
);

export const SET_EVENT_PRINCIPAL_PROFILE =
  '[Public Event Dashboard] Set event principal profile';
export const setEventPrincipalProfile = createAction(
  SET_EVENT_PRINCIPAL_PROFILE,
  props<{ eventPrincipal: PublicEventPrincipalDTO }>()
);

export const CREATE_PUBLIC_EVENT_PROFILE =
  '[Create Public Event] Create public event profile';
export const createPublicEventProfile = createAction(
  CREATE_PUBLIC_EVENT_PROFILE,
  props<{
    createPublicEvent: CreatePublicEvent;
  }>()
);

export const RESET_CREATE_PUBLIC_EVENT_VALUES =
  '[Create Public Event] Reset create edit public event store values';
export const resetCreatePublicEventValues = createAction(
  RESET_CREATE_PUBLIC_EVENT_VALUES
);

export const UPDATE_PUBLIC_EVENT_DETAILS =
  '[Public Event Dashboard] Update public event details';
export const updatePublicEventDetails = createAction(
  UPDATE_PUBLIC_EVENT_DETAILS,
  props<{
    eventDetails: EventDetailsDTO;
  }>()
);

export const RETRIEVE_PUBLIC_EVENT_LOCATIONS =
  '[Public Event Dashboard] Retrieve public event locations';
export const retrievePublicEventLocations = createAction(
  RETRIEVE_PUBLIC_EVENT_LOCATIONS,
  props<{ profileDTO: ProfileDTO }>()
);

export const RETRIEVE_PUBLIC_EVENT_LOCATION =
  '[Public Event Dashboard] Retrieve public event location';
export const retrievePublicEventLocation = createAction(
  RETRIEVE_PUBLIC_EVENT_LOCATION,
  props<{ eventComponent: EventComponentDTO }>()
);

export const CREATE_PUBLIC_EVENT_LOCATION =
  '[Public Event Dashboard] Create public event location';
export const createPublicEventLocation = createAction(
  CREATE_PUBLIC_EVENT_LOCATION,
  props<{
    createEventLocation: CreateEventLocationDTO;
    profileDTO: ProfileDTO;
  }>()
);

export const CANCEL_PUBLIC_EVENT_LOCATION =
  '[Public Event Dashboard] Cancel public event location';
export const cancelPublicEventLocation = createAction(
  CANCEL_PUBLIC_EVENT_LOCATION,
  props<{
    eventComponent: EventComponentDTO;
    profileDTO: ProfileDTO;
  }>()
);

export const RETRIEVE_PUBLIC_EVENT_DATE =
  '[Public Event Dashboard] Retrieve public event date';
export const retrievePublicEventDate = createAction(
  RETRIEVE_PUBLIC_EVENT_DATE,
  props<{ eventComponent: EventComponentDTO }>()
);

export const CREATE_PUBLIC_EVENT_DATE =
  '[Public Event Dashboard] Create public event date';
export const createPublicEventDate = createAction(
  CREATE_PUBLIC_EVENT_DATE,
  props<{
    createEventDate: CreateEventDateDTO;
    eventComponent: EventComponentDTO;
  }>()
);

export const CANCEL_PUBLIC_EVENT_DATE =
  '[Public Event Dashboard] Cancel public event date';
export const cancelPublicEventDate = createAction(
  CANCEL_PUBLIC_EVENT_DATE,
  props<{
    eventDate: EventComponentDTO;
    dateLocation: EventComponentDTO;
  }>()
);

export const UPDATE_EVENT_DATE_DETAILS =
  '[Public Event Dashboard] Update event date details';
export const updateEventDateDetails = createAction(
  UPDATE_EVENT_DATE_DETAILS,
  props<{ dateDetails: DateDetailsDTO }>()
);

export const CREATE_PUBLIC_EVENT_FEATURE =
  '[Public Event Dashboard] Create public event date feature';
export const createPublicEventFeature = createAction(
  CREATE_PUBLIC_EVENT_FEATURE,
  props<{ providerRequest: ProviderRequestDTO; eventDate: EventComponentDTO }>()
);

export const CANCEL_PUBLIC_EVENT_FEATURE =
  '[Public Event Dashboard] Cancel public event feature';
export const cancelPublicEventFeature = createAction(
  CANCEL_PUBLIC_EVENT_FEATURE,
  props<{ providerRequest: ProviderRequestDTO; eventDate: EventComponentDTO }>()
);

export const RETRIEVE_STAFF_LOCATION_DATES =
  '[Public Event Dashboard] Retrieve staff location dates';
export const retrieveStaffLocationDates = createAction(
  RETRIEVE_STAFF_LOCATION_DATES,
  props<{ eventProvider: EventProviderDTO }>()
);

export const SET_STAFF_LOCATION_DATES =
  '[Public Event Dashboard] Set staff location dates';
export const setStaffLocationDates = createAction(
  SET_STAFF_LOCATION_DATES,
  props<{ staffLocationDates: DateTokenDTO[] }>()
);

export const CREATE_PUBLIC_EVENT_STAFF =
  '[Public Event Core] Create public event staff';
export const createPublicEventStaff = createAction(
  CREATE_PUBLIC_EVENT_STAFF,
  props<{
    providerRequests: ProviderRequestDTO[];
    eventLocation: EventComponentDTO;
  }>()
);

export const UPDATE_PUBLIC_EVENT_STAFF =
  '[Public Event Core] Update public event staff';
export const updatePublicEventStaff = createAction(
  UPDATE_PUBLIC_EVENT_STAFF,
  props<{
    providerRequests: ProviderRequestDTO[];
    eventLocation: EventComponentDTO;
  }>()
);

export const RETRIEVE_EVENT_PRINCIPAL_PROFILE =
  '[Public Event Dashboard] Retrieve event principal profile';
export const retrieveEventPrincipalProfile = createAction(
  RETRIEVE_EVENT_PRINCIPAL_PROFILE,
  props<{ profileDTO: ProfileDTO }>()
);

export const CANCEL_PUBLIC_EVENT =
  '[Public Event Dashboard] Cancel public event';
export const cancelPublicEvent = createAction(
  CANCEL_PUBLIC_EVENT,
  props<{ profileDTO: ProfileDTO }>()
);

export const CREATE_GATE_CREW = '[Public Event Dashboard] Create gate crew';
export const createGateCrew = createAction(
  CREATE_GATE_CREW,
  props<{
    providerRequests: ProviderRequestDTO[];
    eventLocation: EventComponentDTO;
  }>()
);

export const UPDATE_GATE_CREW = '[Public Event Dashboard] Update gate crew';
export const updateGateCrew = createAction(
  UPDATE_GATE_CREW,
  props<{
    providerRequests: ProviderRequestDTO[];
    eventLocation: EventComponentDTO;
  }>()
);

export const RETRIEVE_LOCATION_GATE_CREW =
  '[Public Event Dashboard] Retrieve location gate crew';
export const retrieveLocationGateCrew = createAction(
  RETRIEVE_LOCATION_GATE_CREW,
  props<{ eventLocation: EventComponentDTO }>()
);

export const SET_LOCATION_GATE_CREW =
  '[Public Event Dashboard] Set location gate crew';
export const setLocationGateCrew = createAction(
  SET_LOCATION_GATE_CREW,
  props<{ locationGateCrew: ServiceProviderDTO[] }>()
);

export const RETRIEVE_GATE_CREW_LOCATION_DATES =
  '[Public Event Dashboard] Retrieve gate crew location dates';
export const retrieveGateCrewLocationDates = createAction(
  RETRIEVE_GATE_CREW_LOCATION_DATES,
  props<{ eventProvider: EventProviderDTO }>()
);

export const SET_GATE_CREW_LOCATION_DATES =
  '[Public Event Dashboard] Set gate crew location dates';
export const setGateCrewLocationDates = createAction(
  SET_GATE_CREW_LOCATION_DATES,
  props<{ gateCrewLocationDates: DateTokenDTO[] }>()
);
