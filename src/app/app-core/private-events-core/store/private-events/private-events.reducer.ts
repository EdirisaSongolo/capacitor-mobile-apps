import { createReducer, on } from '@ngrx/store';

import {
  storeUserManagedPrivateEvents,
  storePrivateEvent,
  storeUserInvitation,
  storeUserPrivateEvent,
  storeEventFeatures,
  storeEventGuests,
} from '@private-events-core/store/private-events/private-events.actions';
import { PrivateEventStore } from '@private-events-core/store/private-events/constants';

export const privateEvent: PrivateEventStore = {
  privateEventToken: null,
  managedPrivateEvents: [],
  userInvitation: null,
  userPrivateEvent: null,
  eventGuests: [],
  eventFeatures: [],
};

export const privateEventReducer = createReducer(
  privateEvent,
  on(storePrivateEvent, (state, { privateEventToken }) => ({
    ...state,
    privateEventToken: privateEventToken,
  })),
  on(storeUserManagedPrivateEvents, (state, { privateEvents }) => ({
    ...state,
    managedPrivateEvents: privateEvents,
  })),
  on(storeUserInvitation, (state, { invitation }) => ({
    ...state,
    userInvitation: invitation,
  })),
  on(storeUserPrivateEvent, (state, { userPrivateEvent }) => ({
    ...state,
    userPrivateEvent: userPrivateEvent,
  })),
  on(storeEventGuests, (state, { eventGuests }) => ({
    ...state,
    eventGuests: eventGuests,
  })),
  on(storeEventFeatures, (state, { eventFeatures }) => ({
    ...state,
    eventFeatures: eventFeatures,
  }))
);
