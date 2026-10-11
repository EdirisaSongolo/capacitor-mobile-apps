import {
  PrivateEventGuestDTO,
  PrivateEventLocationDTO,
} from '@app-core/private-events-core/api';
import {
  CreateEventControl,
  CreatePrivateEventPanel,
  DateTimeAction,
  PrivateEventAction,
} from '@app-core/private-events-core/data-models';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';

export const CREATE_PRIVATE_EVENT: string = 'create_private_event';

export interface CreatePrivateEventStore {
  privateEventAction: PrivateEventAction;
  dateTimeAction: DateTimeAction;
  control: CreateEventControl;
  displayPanel: CreatePrivateEventPanel;
  profileImage: File | string;
  eventId?: string;
  eventName: string;
  eventMedia: File[];
  eventInvitation: string;
  eventHost: UserTokenDTO;
  startTime: string;
  endTime: string;
  eventDate: string;
  eventLocation: PrivateEventLocationDTO;
  eventFeatures: ServiceProviderDTO[];
  eventStaff: ServiceProviderDTO[];
  eventGuests: PrivateEventGuestDTO[];
}
