import { Profiles } from '@domain-data-models/app-domain.enums';
import { PrivateEventTokenDTO } from '@private-events-core/api';
import { PublicEventTokenDTO } from '@public-events-core/api';
import { UserTokenDTO } from '@user-profile-core/api';
import { VendorTokenDTO } from '@vendors-core/api';
import { VenueTokenDTO } from '@venues-core/api';

export interface LocationDTO {
  address?: string;
  postalCode?: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  timeZone?: string;
}

export interface LocationCategoriesDTO {
  categories: string[];
  location: LocationDTO;
}

export interface ErrorResponseDTO {
  errorMessages: string[];
  timeStamp: Date;
}

export interface SuccessResponseDTO {
  successMessages: string[];
  parameters?: Map<string, string>;
  timeStamp: Date;
}

export interface ProfileDTO {
  profile: Profiles;
  profileId: string;
  profileName?: string;
  profileImage?: string;
}

export interface ProfilesListDTO {
  profile: string;
  profilesIds?: string[];
}

export interface SearchDTO {
  searchParam: string;
}

export interface ProviderRequestDTO {
  referenceId?: string;
  provider: ProfileDTO;
  requestStatus?: string;
}

export interface ResourceReferenceDTO {
  resource: string;
  referenceId: string;
}

export interface ProfileToken {
  profile: Profiles;
}

export interface UserEvent extends ProfileToken {
  eventType?: string;
  userAccess?: string;
}

export type UserEventDTO = PublicEventTokenDTO | PrivateEventTokenDTO;

export type ProfileTokenDTO =
  | UserTokenDTO
  | VendorTokenDTO
  | VenueTokenDTO
  | PublicEventTokenDTO
  | PrivateEventTokenDTO;
