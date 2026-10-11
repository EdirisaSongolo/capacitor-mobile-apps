import { createReducer, on } from '@ngrx/store';
import { CreatePrivateEventStore } from '@private-events-core/store/create-edit-event';
import { CreatePrivateEventPanel } from '@app-core/private-events-core/data-models';
import {
  setPrivateEventDate,
  updatePrivateEventGuests,
  setPrivateEventInvitation,
  setPrivateEventLocation,
  updatePrivateEventMedia,
  setPrivateEventName,
  setPrivateEventProfileImage,
  setPrivateEventTime,
  updatePrivateEventStaff,
  updatePrivateEventControl,
  updatePrivateEventDisplayPanel,
  updatePrivateEventFeatures,
  setPrivateEventAction,
  setDateTimeAction,
  resetCreatePrivateEventValues,
  setPrivateEventHost,
  storePrivateEventFeatures,
} from '@private-events-core/store/create-edit-event/create-edit-event.actions';

export const createPrivateEvent: CreatePrivateEventStore = {
  privateEventAction: null,
  dateTimeAction: null,
  control: null,
  displayPanel: CreatePrivateEventPanel.name_profileImage,
  profileImage: null,
  eventName: null,
  eventMedia: [],
  eventInvitation: null,
  eventHost: null,
  startTime: null,
  endTime: null,
  eventDate: null,
  eventLocation: null,
  eventFeatures: [],
  eventStaff: [],
  eventGuests: [],
};

export const createPrivateEventReducer = createReducer(
  createPrivateEvent,
  on(setPrivateEventAction, (state, { privateEventAction }) => ({
    ...state,
    privateEventAction: privateEventAction,
  })),
  on(setDateTimeAction, (state, { dateTimeAction: dateAction }) => ({
    ...state,
    dateTimeAction: dateAction,
  })),

  on(updatePrivateEventControl, (state, { control }) => ({
    ...state,
    control: control,
  })),
  on(updatePrivateEventDisplayPanel, (state, { displayPanel }) => ({
    ...state,
    displayPanel: displayPanel,
  })),
  on(setPrivateEventProfileImage, (state, { profileImage }) => ({
    ...state,
    profileImage: profileImage,
  })),
  on(setPrivateEventName, (state, { eventName }) => ({
    ...state,
    eventName: eventName,
  })),
  on(updatePrivateEventMedia, (state, { eventMedia }) => ({
    ...state,
    eventMedia: [...eventMedia],
  })),
  on(setPrivateEventInvitation, (state, { eventInvitation }) => ({
    ...state,
    eventInvitation: eventInvitation,
  })),
  on(setPrivateEventLocation, (state, { eventLocation }) => ({
    ...state,
    eventLocation: eventLocation,
  })),
  on(setPrivateEventHost, (state, { eventHost }) => ({
    ...state,
    eventHost: eventHost,
  })),
  on(setPrivateEventTime, (state, { startTime, endTime }) => ({
    ...state,
    startTime: startTime,
    endTime: endTime,
  })),
  on(setPrivateEventDate, (state, { eventDate }) => ({
    ...state,
    eventDate: eventDate,
  })),
  on(updatePrivateEventFeatures, (state, { eventFeatures }) => ({
    ...state,
    eventFeatures: [...eventFeatures],
  })),
  on(updatePrivateEventStaff, (state, { eventStaff }) => ({
    ...state,
    eventStaff: [...eventStaff],
  })),
  on(updatePrivateEventGuests, (state, { eventGuests }) => ({
    ...state,
    eventGuests: [...eventGuests],
  })),
  on(resetCreatePrivateEventValues, () => ({ ...createPrivateEvent })),
  on(storePrivateEventFeatures, (state, { eventFeatures }) => ({
    ...state,
    eventFeatures: [...eventFeatures],
  }))
);
