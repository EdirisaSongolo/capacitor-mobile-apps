import { createReducer, on } from '@ngrx/store';
import {
  CreatePublicEventPanel,
  EventStaffDisplay,
  LocationsDisplay,
} from '@public-events-core/data-models';
import { CreatePublicEventStore } from '@public-events-core/store/create-edit-event/constants';

import {
  setPublicEventCategory,
  setPublicEventName,
  setPublicEventProfileImage,
  setPublicEventControl,
  setPublicEventDisplayPanel,
  updatePublicEventMedia,
  setPublicEventDescription,
  updateEventLocations,
  setPublicEventLocation,
  setPublicEventAction,
  setLocationAction,
  setLocationDateAction,
  updateLocationDates,
  setPublicEventDate,
  setEventId,
  setLocationsDisplay,
  setStaffLocationDates,
  setEventPrincipalProfile,
  setEventStaffDisplay,
  resetCreatePublicEventValues,
} from '@public-events-core/store/create-edit-event/create-edit-event.actions';

export const createEditPublicEvent: CreatePublicEventStore = {
  publicEventAction: null,
  locationAction: null,
  locationDateAction: null,
  control: null,
  locationsDisplay: LocationsDisplay.create_edit_location,
  staffDisplay: EventStaffDisplay.event_locations,
  displayPanel: CreatePublicEventPanel.category_name,
  createPublicEventDTO: null,
  eventId: null,
  eventCategory: null,
  eventName: null,
  profileImage: null,
  eventStatus: null,
  eventMedia: [],
  eventDescription: null,
  eventLocations: [],
  publicEventLocation: null,
  publicEventDate: null,
  eventPrincipal: null,
  staffLocationDates: [],
};

export const createEditPublicEventReducer = createReducer(
  createEditPublicEvent,
  on(setPublicEventAction, (state, { publicEventAction }) => ({
    ...state,
    publicEventAction: publicEventAction,
  })),
  on(setLocationAction, (state, { locationAction }) => ({
    ...state,
    locationAction: locationAction,
  })),
  on(setLocationDateAction, (state, { locationDateAction }) => ({
    ...state,
    locationDateAction: locationDateAction,
  })),
  on(setPublicEventControl, (state, { control }) => ({
    ...state,
    control: control,
  })),
  on(setLocationsDisplay, (state, { locationsDisplay }) => ({
    ...state,
    locationsDisplay: locationsDisplay,
  })),
  on(setEventStaffDisplay, (state, { staffDisplay }) => ({
    ...state,
    staffDisplay: staffDisplay,
  })),
  on(setPublicEventDisplayPanel, (state, { displayPanel }) => ({
    ...state,
    displayPanel: displayPanel,
  })),
  on(setEventId, (state, { eventId }) => ({ ...state, eventId: eventId })),
  on(setPublicEventCategory, (state, { eventCategory }) => ({
    ...state,
    eventCategory: eventCategory,
  })),
  on(setPublicEventProfileImage, (state, { profileImage }) => ({
    ...state,
    profileImage: profileImage,
  })),
  on(setPublicEventName, (state, { eventName }) => ({
    ...state,
    eventName: eventName,
  })),
  on(updatePublicEventMedia, (state, { eventMedia }) => ({
    ...state,
    eventMedia: eventMedia,
  })),
  on(setPublicEventDescription, (state, { eventDescription }) => ({
    ...state,
    eventDescription: eventDescription,
  })),
  on(setPublicEventLocation, (state, { publicEventLocation }) => ({
    ...state,
    publicEventLocation: publicEventLocation,
  })),
  on(updateEventLocations, (state, { eventLocations }) => ({
    ...state,
    eventLocations: [...eventLocations],
  })),
  on(setPublicEventDate, (state, { publicEventDate }) => ({
    ...state,
    publicEventDate: publicEventDate,
  })),
  on(updateLocationDates, (state, { locationDates }) => ({
    ...state,
    publicEventLocation: {
      ...state.publicEventLocation,
      eventDates: [...locationDates],
    },
  })),
  on(setStaffLocationDates, (state, { staffLocationDates }) => ({
    ...state,
    staffLocationDates: staffLocationDates,
  })),
  on(setEventPrincipalProfile, (state, { eventPrincipal }) => ({
    ...state,
    eventPrincipal: { ...eventPrincipal },
  })),
  on(resetCreatePublicEventValues, () => ({ ...createEditPublicEvent }))
);
