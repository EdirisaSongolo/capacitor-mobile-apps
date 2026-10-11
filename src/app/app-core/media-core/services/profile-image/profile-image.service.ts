import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import {
  AppResponseType,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { AppResponse } from '@domain-data-models/app-domain.interfaces';
import { ProfileMediaFileDTO } from '@media-core/api';
import { updateVenueProfileImage } from '@venues-core/store';
import { updateVendorProfileImage } from '@vendors-core/store';
import { createAppResponse, updateUserProfileImage } from '@core-modules';
import { UserProfileConstants } from '@user-profile-core/data-models';
import { VendorsConstants } from '@vendors-core/data-models';
import { VenuesConstants } from '@venues-core/data-models';
import { PublicEventConstants } from '@public-events-core/data-models';
import { PrivateEventConstants } from '@private-events-core/data-models';

@Injectable({
  providedIn: 'root',
})
export class ProfileImageService {
  constructor(
    private store: Store,
    private translator: TranslateService
  ) {}

  public defaultProfileImage(profile: Profiles): string {
    if (profile === Profiles.publicEventProfile) {
      return `url(${PublicEventConstants.DEFAULT_PROFILE_IMAGE}) center / contain no-repeat`;
    } else if (profile === Profiles.privateEventProfile) {
      return `url(${PrivateEventConstants.DEFAULT_PROFILE_IMAGE}) center / contain no-repeat`;
    } else if (profile === Profiles.vendorProfile) {
      return `url(${VendorsConstants.DEFAULT_PROFILE_IMAGE}) center / contain no-repeat`;
    } else if (profile === Profiles.venueProfile) {
      return `url(${VenuesConstants.DEFAULT_PROFILE_IMAGE}) center / contain no-repeat`;
    } else {
      return `url(${UserProfileConstants.DEFAULT_PROFILE_IMAGE}) center / contain no-repeat`;
    }
  }

  // Think about returning null instead of throwing an error.

  public readProfileImageFile(profileImageFile: File): Promise<string> {
    const error: string = 'common.error-reading-media-file';
    if (profileImageFile !== null && typeof profileImageFile !== 'object') {
      throw new Error(error);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = file => {
        const profileImage = file.target.result as string;
        resolve(profileImage);
      };
      reader.onerror = () => reject(error);
      reader.readAsDataURL(profileImageFile);
    });
  }

  public successfullyUpdatedProfileImage(
    profileMediaFile: ProfileMediaFileDTO
  ): Action[] {
    const actions: Action[] = [];

    const successMessage: string = 'media.api-responses.updated-profile-image';
    const appResponse: AppResponse = {
      viewed: false,
      type: AppResponseType.success,
      messages: [this.translator.instant(successMessage)],
    };
    actions.push(createAppResponse({ appResponse: appResponse }));

    const profile: string = profileMediaFile.profile;
    const mediaFileUrl: string = profileMediaFile.mediaFileUrl;

    switch (profile) {
      case Profiles.userProfile:
        actions.push(
          updateUserProfileImage({
            mediaFileUrl: mediaFileUrl,
          })
        );
        break;

      case Profiles.venueProfile:
        actions.push(
          updateVenueProfileImage({
            mediaFileUrl: mediaFileUrl,
          })
        );
        break;

      case Profiles.vendorProfile:
        actions.push(
          updateVendorProfileImage({
            mediaFileUrl: mediaFileUrl,
          })
        );
        break;

      default:
    }

    return actions;
  }
}
