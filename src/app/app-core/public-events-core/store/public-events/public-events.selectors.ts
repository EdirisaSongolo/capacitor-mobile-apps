import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PUBLIC_EVENT,
  PublicEventStore,
} from '@public-events-core/store/public-events/constants';

export const publicEventStore =
  createFeatureSelector<PublicEventStore>(PUBLIC_EVENT);

export const publicEventsSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.publicEvents
);

export const publicEventTokenSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent?.publicEventToken
);

export const eventComponentSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.eventComponent
);

export const publicEventLocationsSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.locationsTokens
);

export const datesDisplaySelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.datesDisplay
);

export const publicEventDatesSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.dateTokens
);

export const eventDateProfileSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.eventDateProfile
);

export const userPublicEventSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.userPublicEvent
);

export const publicEventFeaturesSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.eventFeatures
);

export const publicEventSearchSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.publicEventsSearch
);

export const publicEventPrincipalSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.eventPrincipal
);

export const userGateCrewDatesSelector = createSelector(
  publicEventStore,
  publicEvent => publicEvent.userGateCrewDates
);
