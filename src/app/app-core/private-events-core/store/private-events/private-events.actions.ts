import { createAction, props } from '@ngrx/store';
import { ProfileDTO } from '@app-core/app-api/app-api.dto-models';

import {
  InvitationDTO,
  InviteResponseDTO,
  PrivateEventTokenDTO,
  UserPrivateEventDTO,
} from '@private-events-core/api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';

export const RETRIEVE_PRIVATE_EVENT_TOKEN =
  '[Private Event Core] Retrieve private event token';
export const retrievePrivateEventToken = createAction(
  RETRIEVE_PRIVATE_EVENT_TOKEN,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_PRIVATE_EVENT = '[Private Event Core] Store private core';
export const storePrivateEvent = createAction(
  STORE_PRIVATE_EVENT,
  props<{ privateEventToken: PrivateEventTokenDTO }>()
);

export const RETRIEVE_USER_MANAGED_PRIVATE_EVENTS =
  '[Private Events Dashboard] Retrieve user managed private events';
export const retrieveUserManagedPrivateEvents = createAction(
  RETRIEVE_USER_MANAGED_PRIVATE_EVENTS
);

export const STORE_USER_MANAGED_PRIVATE_EVENTS =
  '[Private Events Dashboard] Store user managed private events';
export const storeUserManagedPrivateEvents = createAction(
  STORE_USER_MANAGED_PRIVATE_EVENTS,
  props<{
    privateEvents: PrivateEventTokenDTO[];
  }>()
);

export const RETRIEVE_USER_PRIVATE_EVENT_TOKEN =
  '[User Account] Retrieve user private event token';
export const retrieveUserPrivateEventToken = createAction(
  RETRIEVE_USER_PRIVATE_EVENT_TOKEN,
  props<{ profileDTO: ProfileDTO }>()
);

export const RETRIEVE_USER_INVITATION =
  '[User Account] Retrieve user invitation';
export const retrieveUserInvitation = createAction(
  RETRIEVE_USER_INVITATION,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_USER_INVITATION =
  '[Private Events Core] Store user invitation';
export const storeUserInvitation = createAction(
  STORE_USER_INVITATION,
  props<{ invitation: InvitationDTO }>()
);

export const UPDATE_INVITATION_STATUS =
  '[User Account] Update invitation status';
export const updateInvitationStatus = createAction(
  UPDATE_INVITATION_STATUS,
  props<{ inviteResponse: InviteResponseDTO; profileDTO: ProfileDTO }>()
);

export const RETRIEVE_USER_PRIVATE_EVENT =
  '[User Account] Retrieve user private event';
export const retrieveUserPrivateEvent = createAction(
  RETRIEVE_USER_PRIVATE_EVENT,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_USER_PRIVATE_EVENT =
  '[User Account] Store user private event';
export const storeUserPrivateEvent = createAction(
  STORE_USER_PRIVATE_EVENT,
  props<{ userPrivateEvent: UserPrivateEventDTO }>()
);

export const RETRIEVE_EVENT_GUESTS =
  '[User Private Event] Retrieve event guests';
export const retrieveEventGuests = createAction(
  RETRIEVE_EVENT_GUESTS,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_EVENT_GUESTS = '[User Private Event] Store Event Guests';
export const storeEventGuests = createAction(
  STORE_EVENT_GUESTS,
  props<{ eventGuests: UserTokenDTO[] }>()
);

export const RETRIEVE_EVENT_FEATURES =
  '[User Private Event] Retrieve event features';
export const retrieveEventFeatures = createAction(
  RETRIEVE_EVENT_FEATURES,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_EVENT_FEATURES =
  '[User Private Event] Store user event features';
export const storeEventFeatures = createAction(
  STORE_EVENT_FEATURES,
  props<{ eventFeatures: ServiceProviderDTO[] }>()
);
