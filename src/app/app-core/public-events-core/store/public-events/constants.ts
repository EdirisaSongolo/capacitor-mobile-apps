import {
  DateTokenDTO,
  LocationTokenDTO,
  PublicEventTokenDTO,
  PublicEventLocationDTO,
  EventDateProfileDTO,
  UserPublicEventDTO,
  EventComponentDTO,
} from '@public-events-core/api/public-events.dto-models';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { DatesDisplay } from '@public-events-core/data-models';

export const PUBLIC_EVENT: string = 'PublicEvent';

export interface PublicEventStore {
  publicEvents: PublicEventTokenDTO[];
  publicEventToken: PublicEventTokenDTO;
  eventComponent: EventComponentDTO;
  locationsTokens: LocationTokenDTO[];
  publicEventLocation: PublicEventLocationDTO;
  datesDisplay: DatesDisplay;
  dateTokens: DateTokenDTO[];
  eventDateProfile: EventDateProfileDTO;
  userPublicEvent: UserPublicEventDTO;
  eventFeatures: ServiceProviderDTO[];
  eventPrincipal: ServiceProviderDTO;
  publicEventsSearch: PublicEventTokenDTO[];
}
