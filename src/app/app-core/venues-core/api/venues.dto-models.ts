import { LocationDTO } from '@app-core/app-api/app-api.dto-models';
import { ProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';

export interface VenueTokenDTO extends ProviderDTO {
  venueProfileId?: string;
  venueName: string;
  profileImage: string;
  venueDescription: string;
  venueLocation: LocationDTO;
}

export interface VenueManagerDTO {
  venueManagerId?: string;
  venueProfileId: string;
  manager: UserTokenDTO;
  managerStatus?: string;
}
