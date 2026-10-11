import { LocationDTO } from '@app-core/app-api/app-api.dto-models';
import { ProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';

export interface VendorTokenDTO extends ProviderDTO {
  vendorProfileId?: string;
  vendorName: string;
  profileImage: string;
  vendorDescription: string;
  vendorLocation: LocationDTO;
}

export interface VendorManagerDTO {
  vendorManagerId?: string;
  vendorProfileId: string;
  manager: UserTokenDTO;
  managerStatus?: string;
}
