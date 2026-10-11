import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PRIVATE_EVENT,
  PrivateEventStore,
} from '@private-events-core/store/private-events/constants';

export const privateEventFeature =
  createFeatureSelector<PrivateEventStore>(PRIVATE_EVENT);

export const privateEventTokenSelector = createSelector(
  privateEventFeature,
  privateEvent => privateEvent.privateEventToken
);

export const userManagedPrivateEventsSelector = createSelector(
  privateEventFeature,
  privateEvent => privateEvent.managedPrivateEvents
);

export const userInvitationSelector = createSelector(
  privateEventFeature,
  privateEvent => privateEvent.userInvitation
);

export const userPrivateEventSelector = createSelector(
  privateEventFeature,
  privateEvent => privateEvent.userPrivateEvent
);

export const eventGuestsSelector = createSelector(
  privateEventFeature,
  privateEvent => privateEvent.eventGuests
);

export const eventFeaturesSelector = createSelector(
  privateEventFeature,
  privateEvent => privateEvent.eventFeatures
);
