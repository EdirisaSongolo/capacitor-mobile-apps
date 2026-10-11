import { createReducer, on } from '@ngrx/store';
import {
  storePublicEvents,
  storeEventLocationsTokens,
  storeEventDatesTokens,
  storePublicEventToken,
  storePublicEventSearchResults,
  storePublicEventFeatures,
  storePublicEventPrincipal,
  storeEventDateProfile,
  storeUserPublicEvent,
  setDatesDisplay,
  setEventComponent,
} from '@public-events-core/store/public-events/public-events.actions';

import { PublicEventStore } from '@public-events-core/store/public-events/constants';

export const PublicEvent: PublicEventStore = {
  publicEvents: [],
  publicEventToken: null,
  locationsTokens: [],
  eventComponent: null,
  publicEventLocation: null,
  datesDisplay: null,
  dateTokens: [],
  eventDateProfile: null,
  userPublicEvent: null,
  eventFeatures: [],
  eventPrincipal: null,
  publicEventsSearch: [],
};

export const publicEventReducer = createReducer(
  PublicEvent,
  on(storePublicEventToken, (state, { publicEventToken }) => ({
    ...state,
    publicEventToken: publicEventToken,
  })),
  on(storePublicEvents, (state, { publicEvents }) => ({
    ...state,
    publicEvents: publicEvents,
  })),
  on(setEventComponent, (state, { eventComponent }) => ({
    ...state,
    eventComponent: eventComponent,
  })),
  on(storeEventLocationsTokens, (state, { locationsTokens }) => ({
    ...state,
    locationsTokens: locationsTokens,
  })),
  on(setDatesDisplay, (state, { datesDisplay }) => ({
    ...state,
    datesDisplay: datesDisplay,
  })),
  on(storeEventDatesTokens, (state, { dateTokens: publicEventDates }) => ({
    ...state,
    dateTokens: publicEventDates,
  })),
  on(storeEventDateProfile, (state, { eventDateProfile }) => ({
    ...state,
    eventDateProfile: eventDateProfile,
  })),
  on(storeUserPublicEvent, (state, { userPublicEvent }) => ({
    ...state,
    userPublicEvent: userPublicEvent,
    eventPrincipal: userPublicEvent.publicEventPrincipal.principalProfile,
    eventFeatures: userPublicEvent.publicEventDate.dateFeatures,
  })),
  on(storePublicEventFeatures, (state, { eventFeatures }) => ({
    ...state,
    eventFeatures: eventFeatures,
  })),
  on(storePublicEventPrincipal, (state, { eventPrincipal }) => ({
    ...state,
    eventPrincipal: eventPrincipal,
  })),
  on(storePublicEventSearchResults, (state, { publicEvents }) => ({
    ...state,
    publicEventsSearch: publicEvents,
  }))
);
