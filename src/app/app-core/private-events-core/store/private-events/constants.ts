import {
  InvitationDTO,
  PrivateEventTokenDTO,
  UserPrivateEventDTO,
} from '@private-events-core/api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';

export const PRIVATE_EVENT: string = 'PrivateEvent';

export interface PrivateEventStore {
  managedPrivateEvents: PrivateEventTokenDTO[];
  privateEventToken: PrivateEventTokenDTO;
  userInvitation: InvitationDTO;
  userPrivateEvent: UserPrivateEventDTO;
  eventGuests: UserTokenDTO[];
  eventFeatures: ServiceProviderDTO[];
}
