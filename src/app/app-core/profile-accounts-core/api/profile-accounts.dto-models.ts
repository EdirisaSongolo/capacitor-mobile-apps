import { LocationDTO, ProfileToken } from '@app-core/app-api';
import {
  BusinessProfileStatus,
  ServiceOption,
} from '@profile-accounts-core/data-models';

import { UserTokenDTO } from '@user-profile-core/api/user-profile.dto-models';
import { VendorTokenDTO } from '@vendors-core/api/vendors.dto-models';
import { VenueTokenDTO } from '@venues-core/api/venues.dto-models';

export interface BusinessProfileDTO {
  businessProfileId: string;
  profile: string;
  profileId: string;
  businessCategory: string;
  paymentRateInCents: number;
  rateUnits: string;
  profileStatus: BusinessProfileStatus;
  services: any[];
}

export interface ProviderServiceDTO {
  serviceId?: string;
  serviceProviderId: string;
  option: ServiceOption;
  service: string;
  price?: number;
}

export interface ProviderDTO extends ProfileToken {
  businessProfile?: BusinessProfileDTO;
  profileLocation?: LocationDTO;
}

export type ServiceProviderDTO = UserTokenDTO | VendorTokenDTO | VenueTokenDTO;
