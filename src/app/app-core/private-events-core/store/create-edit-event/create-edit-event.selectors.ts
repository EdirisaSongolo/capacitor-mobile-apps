import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CREATE_PRIVATE_EVENT,
  CreatePrivateEventStore,
} from '@private-events-core/store/create-edit-event/constants';

export const createPrivateEventStore =
  createFeatureSelector<CreatePrivateEventStore>(CREATE_PRIVATE_EVENT);

export const privateEventControlSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.control
);

export const privateEventActionSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.privateEventAction
);

export const dateTimeActionSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.dateTimeAction
);

export const privateEventDisplaySelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.displayPanel
);

export const profileImageSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.profileImage
);

export const privateEventNameSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.eventName
);

export const privateEventHostSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.eventHost
);

export const privateEventStartTimeSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.startTime
);

export const privateEventEndTimeSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.endTime
);

export const privateEventDateSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.eventDate
);

export const privateEventInvitationSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.eventInvitation
);

export const privateEventMediaSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.eventMedia
);

export const privateEventLocationSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.eventLocation
);

export const privateEventGuestsSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.eventGuests
);

export const privateEventFeaturesSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.eventFeatures
);

export const privateEventStaffSelector = createSelector(
  createPrivateEventStore,
  createPrivateEvent => createPrivateEvent.eventStaff
);
