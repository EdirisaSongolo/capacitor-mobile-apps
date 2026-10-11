import { ProviderServiceDTO } from '@profile-accounts-core/api/profile-accounts.dto-models';
import { BusinessProfileStatus } from '@profile-accounts-core/data-models/profile-accounts.enums';

export interface ProviderDetails {
  profileImage: string;
  profileName: string;
  businessCategory: string;
  profileLocation: string;
  profileBaseRate: number;
  profileRateUnits: string;
  profileServices: ProviderServiceDTO[];
  profileStatus: BusinessProfileStatus;
}

export interface BusinessProfileDetails {
  businessCategory?: string;
  profileBaseRate?: number;
  profileRateUnits?: string;
  profileServices?: any[];
  profileStatus?: BusinessProfileStatus;
}

export interface ProviderPlacDetails {
  businessCategory: string;
  profileBaseRate: number;
}
