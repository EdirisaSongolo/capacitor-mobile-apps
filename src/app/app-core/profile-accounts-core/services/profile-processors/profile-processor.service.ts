import { Injectable } from '@angular/core';
import { Profiles } from '@domain-data-models/app-domain.enums';
import {
  BusinessProfileDTO,
  ServiceProviderDTO,
} from '@profile-accounts-core/api';

import {
  BusinessProfileDetails,
  ProfileAccountsConstants,
  ProviderPlacDetails,
  RateUnitsOptions,
  UserProfileCategories,
  VendorCategories,
  VenueCategories,
} from '@profile-accounts-core/data-models';

@Injectable({
  providedIn: 'root',
})
export class ProfileProcessorService {
  constructor() {}

  public processBusinessProfile(
    businessProfile: BusinessProfileDTO
  ): BusinessProfileDetails {
    const businessProfileDetails: BusinessProfileDetails = {};

    businessProfileDetails.profileStatus = businessProfile.profileStatus;

    const businessCategory = this.processBusinessCategory(
      businessProfile.profile,
      businessProfile.businessCategory
    );

    businessProfileDetails.businessCategory = businessCategory;

    const paymentRateInCents = businessProfile?.paymentRateInCents;
    if (paymentRateInCents && paymentRateInCents !== 0) {
      businessProfileDetails.profileBaseRate =
        businessProfile.paymentRateInCents;
    }

    const profileRateUnits = businessProfile.rateUnits;
    const rateUnits: string[][] = Object.entries(RateUnitsOptions).map(
      ([name, value]) => [name, value]
    );
    const optionsList = ProfileAccountsConstants.RateUnitsOptionsList;
    rateUnits.forEach(([name, value]) => {
      if (value === profileRateUnits) {
        businessProfileDetails.profileRateUnits =
          optionsList[
            name as keyof typeof ProfileAccountsConstants.RateUnitsOptionsList
          ];
      }
    });

    if (businessProfile?.services) {
      businessProfileDetails.profileServices = [...businessProfile.services];
    }

    return businessProfileDetails;
  }

  public processProviderPlacDetails(
    serviceProvider: ServiceProviderDTO
  ): ProviderPlacDetails | null {
    const businessProfile = serviceProvider?.businessProfile;
    if (!businessProfile?.businessProfileId) return null;

    const businessProfileDetails = this.processBusinessProfile(businessProfile);
    let businessCategory: string = ProfileAccountsConstants.other;
    if (businessProfileDetails.businessCategory) {
      businessCategory = businessProfileDetails.businessCategory;
    }

    const providerPlacDetails: ProviderPlacDetails = {
      businessCategory: businessCategory,
      profileBaseRate: businessProfileDetails.profileBaseRate,
    };

    return providerPlacDetails;
  }

  public processBusinessCategory(
    profile: string,
    businessCategory: string
  ): string {
    let businessCategoryName: string;

    if (profile === Profiles.userProfile) {
      const categoryNames = ProfileAccountsConstants.UserProfileCategoriesList;
      Object.entries(UserProfileCategories).forEach(([name, value]) => {
        if (value === businessCategory) {
          if (name !== 'other') {
            businessCategoryName =
              categoryNames[name as keyof typeof categoryNames];
          }
        }
      });
    } else if (profile === Profiles.vendorProfile) {
      const categoryNames = ProfileAccountsConstants.VendorCategoriesList;
      Object.entries(VendorCategories).forEach(([name, value]) => {
        if (value === businessCategory) {
          if (name !== 'other') {
            businessCategoryName =
              categoryNames[name as keyof typeof categoryNames];
          }
        }
      });
    } else if (profile === Profiles.venueProfile) {
      const categoryNames = ProfileAccountsConstants.VenueCategoriesList;
      Object.entries(VenueCategories).forEach(([name, value]) => {
        if (value === businessCategory) {
          if (name !== 'other') {
            businessCategoryName =
              categoryNames[name as keyof typeof categoryNames];
          }
        }
      });
    }

    return businessCategoryName;
  }
}
