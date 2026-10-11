import { UserEventDTO } from '@app-core/app-api';
import {
  BusinessProfileDTO,
  ServiceProviderDTO,
} from '@profile-accounts-core/api';

export const PROFILE_ACCOUNTS: string = 'profile-accounts';

export interface ProfileAccountsStore {
  managedProfiles: ServiceProviderDTO[];
  businessProfile: BusinessProfileDTO;
  serviceProviders: ServiceProviderDTO[];
  providerSearchResults: ServiceProviderDTO[];
  serviceProvider: ServiceProviderDTO;
  userEvents: UserEventDTO[];
  userEvent: UserEventDTO;
}
