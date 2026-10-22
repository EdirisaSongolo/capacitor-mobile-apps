import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CREATE_PUBLIC_EVENT,
  CreatePublicEventStore,
} from '@public-events-core/store/create-edit-event/constants';

export const createEditPublicEventFeature =
  createFeatureSelector<CreatePublicEventStore>(CREATE_PUBLIC_EVENT);

export const publicEventActionSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.publicEventAction
);

export const locationActionSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.locationAction
);

export const locationDateActionSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.locationDateAction
);

export const publicEventControlSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.control
);

export const locationsDisplaySelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent?.locationsDisplay
);

export const staffDisplaySelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent?.staffDisplay
);

export const publicEventDisplaySelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent?.displayPanel
);

export const eventIdSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.eventId
);

export const eventCategorySelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.eventCategory
);

export const publicEventProfileImageSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.profileImage
);

export const eventNameSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.eventName
);

export const eventMediaSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.eventMedia
);

export const eventDescriptionSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.eventDescription
);

export const eventLocationsSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.eventLocations
);

export const publicEventLocationSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.publicEventLocation
);

export const publicEventDateSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.publicEventDate
);

export const staffLocationDatesSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.staffLocationDates
);

export const locationGateCrewSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.locationGateCrew
);

export const gateCrewLocationDatesSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.gateCrewLocationDates
);

export const eventPrincipalSelector = createSelector(
  createEditPublicEventFeature,
  createPublicEvent => createPublicEvent.eventPrincipal
);
