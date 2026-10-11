import {
  CreateEventControl,
  CreatePublicEventPanel,
  PublicEventAction,
  LocationAction,
  LocationDateAction,
  LocationsDisplay,
  EventStaffDisplay,
} from '@public-events-core/data-models';

import {
  CreatePublicEvent,
  DateTokenDTO,
  PublicEventDateDTO,
  PublicEventLocationDTO,
  PublicEventPrincipalDTO,
} from '@public-events-core/api/public-events.dto-models';

export const CREATE_PUBLIC_EVENT = 'create-public-event';

export interface CreatePublicEventStore {
  publicEventAction: PublicEventAction;
  locationAction: LocationAction;
  locationDateAction: LocationDateAction;
  control: CreateEventControl;
  locationsDisplay: LocationsDisplay;
  staffDisplay: EventStaffDisplay;
  displayPanel: CreatePublicEventPanel;
  createPublicEventDTO: CreatePublicEvent;
  eventId?: string;
  eventName: string;
  eventCategory: string;
  profileImage: File | string;
  eventStatus?: string;
  eventMedia: File[];
  eventDescription: string;
  eventLocations: PublicEventLocationDTO[];
  publicEventLocation: PublicEventLocationDTO;
  publicEventDate: PublicEventDateDTO;
  eventPrincipal: PublicEventPrincipalDTO;
  staffLocationDates: DateTokenDTO[];
}
