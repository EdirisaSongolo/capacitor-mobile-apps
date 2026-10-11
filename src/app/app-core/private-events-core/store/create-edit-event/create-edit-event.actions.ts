import { ProfileDTO, ProviderRequestDTO } from '@app-core/app-api';
import {
  CreatePrivateEvent,
  PrivateEventGuestDTO,
  PrivateEventLocationDTO,
  EventUpdateDTO,
} from '@app-core/private-events-core/api';
import {
  CreateEventControl,
  CreatePrivateEventPanel,
  DateTimeAction,
  PrivateEventAction,
} from '@app-core/private-events-core/data-models';

import { createAction, props } from '@ngrx/store';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';

export const SET_PRIVATE_EVENT_ACTION =
  '[Event Creation and Dashboard] Set event creation action';
export const setPrivateEventAction = createAction(
  SET_PRIVATE_EVENT_ACTION,
  props<{ privateEventAction: PrivateEventAction }>()
);

export const SET_DATE_TIME_ACTION =
  '[Private Events Core] Set event date time action';
export const setDateTimeAction = createAction(
  SET_DATE_TIME_ACTION,
  props<{ dateTimeAction: DateTimeAction }>()
);

export const PRIVATE_EVENT_CONTROL =
  '[Create Private Event] Update public event control';
export const updatePrivateEventControl = createAction(
  PRIVATE_EVENT_CONTROL,
  props<{ control: CreateEventControl }>()
);

export const PRIVATE_EVENT_DISPLAY_PANEL =
  '[Create Private Event] Update private event panel display component';
export const updatePrivateEventDisplayPanel = createAction(
  PRIVATE_EVENT_DISPLAY_PANEL,
  props<{ displayPanel: CreatePrivateEventPanel }>()
);

export const SET_PRIVATE_EVENT_PROFILE_IMAGE =
  '[Create Private Event] Set private event profile image';
export const setPrivateEventProfileImage = createAction(
  SET_PRIVATE_EVENT_PROFILE_IMAGE,
  props<{
    profileImage: File | string;
  }>()
);

export const SET_PRIVATE_EVENT_NAME =
  '[Create Private Event] Set private event name';
export const setPrivateEventName = createAction(
  SET_PRIVATE_EVENT_NAME,
  props<{
    eventName: string;
  }>()
);

export const UPDATE_PRIVATE_EVENT_MEDIA =
  '[Create Private Event] Update private event media';
export const updatePrivateEventMedia = createAction(
  UPDATE_PRIVATE_EVENT_MEDIA,
  props<{ eventMedia: File[] }>()
);

export const SET_PRIVATE_EVENT_INVITATION =
  '[Create Private Event] Set private event invitation';
export const setPrivateEventInvitation = createAction(
  SET_PRIVATE_EVENT_INVITATION,
  props<{ eventInvitation: string }>()
);

export const SET_PRIVATE_EVENT_LOCATION =
  '[Create Private Event] Set private event location';
export const setPrivateEventLocation = createAction(
  SET_PRIVATE_EVENT_LOCATION,
  props<{ eventLocation: PrivateEventLocationDTO }>()
);

export const SET_PRIVATE_EVENT_HOST =
  '[Private Events Core] Set private event host';
export const setPrivateEventHost = createAction(
  SET_PRIVATE_EVENT_HOST,
  props<{ eventHost: UserTokenDTO }>()
);

export const SET_PRIVATE_EVENT_TIME =
  '[Private Events Core] Set private event time';
export const setPrivateEventTime = createAction(
  SET_PRIVATE_EVENT_TIME,
  props<{ startTime: string; endTime: string }>()
);

export const SET_PRIVATE_EVENT_DATE =
  '[Private Events Core] Set private event date';
export const setPrivateEventDate = createAction(
  SET_PRIVATE_EVENT_DATE,
  props<{ eventDate: string }>()
);

export const UPDATE_PRIVATE_EVENT_FEATURES =
  '[Private Event Core] Update private event features';
export const updatePrivateEventFeatures = createAction(
  UPDATE_PRIVATE_EVENT_FEATURES,
  props<{
    eventFeatures: ServiceProviderDTO[];
  }>()
);

export const UPDATE_PRIVATE_EVENT_STAFF =
  '[Private Event Core] Update private event staff';
export const updatePrivateEventStaff = createAction(
  UPDATE_PRIVATE_EVENT_STAFF,
  props<{
    eventStaff: ServiceProviderDTO[];
  }>()
);

export const UPDATE_PRIVATE_EVENT_GUESTS =
  '[Create Private Event] Update private event guests';
export const updatePrivateEventGuests = createAction(
  UPDATE_PRIVATE_EVENT_GUESTS,
  props<{
    eventGuests: PrivateEventGuestDTO[];
  }>()
);

export const CREATE_PRIVATE_EVENT_PROFILE =
  '[Create Private Event] Create private event profile';
export const createPrivateEventProfile = createAction(
  CREATE_PRIVATE_EVENT_PROFILE,
  props<{ createPrivateEvent: CreatePrivateEvent }>()
);

export const RESET_CREATE_PRIVATE_EVENT_VALUES =
  '[Create Private Event] Reset create edit private event store values';
export const resetCreatePrivateEventValues = createAction(
  RESET_CREATE_PRIVATE_EVENT_VALUES
);

export const UPDATE_PRIVATE_EVENT_DETAILS =
  '[Private Event Dashboard] Update private event details';
export const updatePrivateEventDetails = createAction(
  UPDATE_PRIVATE_EVENT_DETAILS,
  props<{ eventUpdateDTO: EventUpdateDTO }>()
);

export const RETRIEVE_PRIVATE_EVENT_LOCATION =
  '[Private Event Dashboard] Retrieve private event location';
export const retrievePrivateEventLocation = createAction(
  RETRIEVE_PRIVATE_EVENT_LOCATION,
  props<{ profileDTO: ProfileDTO }>()
);

export const UPDATE_PRIVATE_EVENT_LOCATION =
  '[Private Event Dashboard] Update private event location';
export const updatePrivateEventLocation = createAction(
  UPDATE_PRIVATE_EVENT_LOCATION,
  props<{ eventLocation: PrivateEventLocationDTO }>()
);

export const RETRIEVE_PRIVATE_EVENT_FEATURES =
  '[Private Event Dashboard] Retrieve private event features';
export const retrievePrivateEventFeatures = createAction(
  RETRIEVE_PRIVATE_EVENT_FEATURES,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_PRIVATE_EVENT_FEATURES =
  '[Private Event Dashboard] Store private event features';
export const storePrivateEventFeatures = createAction(
  STORE_PRIVATE_EVENT_FEATURES,
  props<{ eventFeatures: ServiceProviderDTO[] }>()
);

export const CREATE_PRIVATE_EVENT_FEATURE =
  '[Private Event Dashboard] Create private event feature';
export const createPrivateEventFeature = createAction(
  CREATE_PRIVATE_EVENT_FEATURE,
  props<{ providerRequest: ProviderRequestDTO; profileDTO: ProfileDTO }>()
);

export const CANCEL_PRIVATE_EVENT_FEATURE =
  '[Private Event Dashboard] Cancel private event feature';
export const cancelPrivateEventFeature = createAction(
  CANCEL_PRIVATE_EVENT_FEATURE,
  props<{ providerRequest: ProviderRequestDTO; profileDTO: ProfileDTO }>()
);

export const RETRIEVE_PRIVATE_EVENT_STAFF =
  '[Private Event Dashboard] Retrieve private event staff';
export const retrievePrivateEventStaff = createAction(
  RETRIEVE_PRIVATE_EVENT_STAFF,
  props<{ profileDTO: ProfileDTO }>()
);

//store event staff

export const CREATE_PRIVATE_EVENT_STAFF =
  '[Private Event Dashboard] Create private event staff';
export const createPrivateEventStaff = createAction(
  CREATE_PRIVATE_EVENT_STAFF,
  props<{ providerRequest: ProviderRequestDTO; profileDTO: ProfileDTO }>()
);

export const CANCEL_PRIVATE_EVENT_STAFF =
  '[Private Event Dashboard] Cancel private event staff';
export const cancelPrivateEventStaff = createAction(
  CANCEL_PRIVATE_EVENT_STAFF,
  props<{ providerRequest: ProviderRequestDTO; profileDTO: ProfileDTO }>()
);

export const RETRIEVE_PRIVATE_EVENT_GUESTS =
  '[Private Event Dashboard] Retrieve private event guests';
export const retrievePrivateEventGuests = createAction(
  RETRIEVE_PRIVATE_EVENT_GUESTS,
  props<{ profileDTO: ProfileDTO }>()
);
export const CREATE_PRIVATE_EVENT_GUEST =
  '[Private Event Dashboard] Retrieve private event guest';
export const createPrivateEventGuest = createAction(
  CREATE_PRIVATE_EVENT_GUEST,
  props<{ eventGuest: PrivateEventGuestDTO; profileDTO: ProfileDTO }>()
);

export const REMOVE_PRIVATE_EVENT_GUEST =
  '[Private Event Dashboard] Remove private event guest';
export const removePrivateEventGuest = createAction(
  REMOVE_PRIVATE_EVENT_GUEST,
  props<{ eventGuest: PrivateEventGuestDTO; profileDTO: ProfileDTO }>()
);

export const CANCEL_PRIVATE_EVENT =
  '[Private Event Dashboard] Cancel private event';
export const cancelPrivateEvent = createAction(
  CANCEL_PRIVATE_EVENT,
  props<{ profileDTO: ProfileDTO }>()
);
