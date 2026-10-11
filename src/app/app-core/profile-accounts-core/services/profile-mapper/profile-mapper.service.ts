import { Injectable } from '@angular/core';
import {
  ProfileDTO,
  ProviderRequestDTO,
} from '@app-core/app-api/app-api.dto-models';
import { Profiles } from '@domain-data-models/app-domain.enums';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';
import { VendorTokenDTO } from '@vendors-core/api';
import { VenueTokenDTO } from '@venues-core/api';

@Injectable({
  providedIn: 'root',
})
export class ProfileMapperService {
  constructor() {}

  public serviceProviderToProfileDTO(
    serviceProvider: ServiceProviderDTO
  ): ProfileDTO {
    let profileDTO: ProfileDTO;

    if (serviceProvider.profile === Profiles.userProfile) {
      const provider = serviceProvider as UserTokenDTO;

      profileDTO = {
        profile: serviceProvider.profile,
        profileId: provider.userProfileId,
        profileName: provider.userName,
        profileImage: provider.profileImage,
      };
    } else if (serviceProvider.profile === Profiles.vendorProfile) {
      const provider = serviceProvider as VendorTokenDTO;

      profileDTO = {
        profile: serviceProvider.profile,
        profileId: provider.vendorProfileId,
        profileName: provider.vendorName,
        profileImage: provider.profileImage,
      };
    } else if (serviceProvider.profile === Profiles.venueProfile) {
      const provider = serviceProvider as VenueTokenDTO;

      profileDTO = {
        profile: serviceProvider.profile,
        profileId: provider.venueProfileId,
        profileName: provider.venueName,
        profileImage: provider.profileImage,
      };
    }

    return profileDTO;
  }

  public profileToServiceProviderDTO(
    profileDTO: ProfileDTO
  ): ServiceProviderDTO {
    let serviceProvider: ServiceProviderDTO;

    if (profileDTO.profile === Profiles.userProfile) {
      const userTokenDTO: UserTokenDTO = {
        profile: profileDTO.profile,
        userProfileId: profileDTO.profileId,
        userName: profileDTO.profileName,
        profileImage: profileDTO.profileImage,
      };
      serviceProvider = { ...userTokenDTO };
    } else if (profileDTO.profile === Profiles.vendorProfile) {
      const vendorTokenDTO: VendorTokenDTO = {
        profile: profileDTO.profile,
        vendorProfileId: profileDTO.profileId,
        vendorName: profileDTO.profileName,
        profileImage: profileDTO.profileImage,
        vendorDescription: null,
        vendorLocation: null,
      };
      serviceProvider = { ...vendorTokenDTO };
    } else if (profileDTO.profile === Profiles.venueProfile) {
      const venueTokenDTO: VenueTokenDTO = {
        profile: profileDTO.profile,
        venueProfileId: profileDTO.profileId,
        venueName: profileDTO.profileName,
        profileImage: profileDTO.profileImage,
        venueDescription: null,
        venueLocation: null,
      };
      serviceProvider = { ...venueTokenDTO };
    }

    return serviceProvider;
  }

  public providerRequestDTOMapper(
    serviceProvider: ServiceProviderDTO
  ): ProviderRequestDTO {
    let profileDTO: ProfileDTO;
    if (serviceProvider.profile === Profiles.venueProfile) {
      return null;
    }

    if (serviceProvider.profile === Profiles.vendorProfile) {
      const vendorTokenDTO: VendorTokenDTO = serviceProvider as VendorTokenDTO;
      profileDTO = {
        profile: serviceProvider.profile,
        profileId: vendorTokenDTO.vendorProfileId,
      };
    }

    if (serviceProvider.profile === Profiles.userProfile) {
      const userTokenDTO: UserTokenDTO = serviceProvider as UserTokenDTO;
      profileDTO = {
        profile: serviceProvider.profile,
        profileId: userTokenDTO.userProfileId,
      };
    }

    const providerRequest: ProviderRequestDTO = {
      provider: profileDTO,
    };

    return providerRequest;
  }
}
