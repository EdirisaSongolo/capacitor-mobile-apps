import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  AppResponse,
  UserProfileInfo,
} from '@domain-data-models/app-domain.interfaces';
import { LocationDTO } from '@app-core/app-api/app-api.dto-models';

export const AUTHENTICATION_STATUS = 'authenticationStatus';
export const USER_PROFILE_INFO = 'userProfileInfo';
export const APP_RESPONSE = 'appResponse';
export const USER_LOCATION = 'userLocation';

export const authStatusSelector = createFeatureSelector<boolean>(
  AUTHENTICATION_STATUS
);

export const userProfileInfoFeature =
  createFeatureSelector<UserProfileInfo>(USER_PROFILE_INFO);

export const userProfileInfoSelector = createSelector(
  userProfileInfoFeature,
  userProfileInfo => userProfileInfo
);

export const userProfileLoadedSelector = createSelector(
  userProfileInfoFeature,
  userProfileInfo => !!userProfileInfo?.userProfileId
);

export const appResponseFeature =
  createFeatureSelector<AppResponse>(APP_RESPONSE);

export const appResponseSelector = createSelector(
  appResponseFeature,
  appResponse => appResponse
);

export const appResponseStatusSelector = createSelector(
  appResponseFeature,
  appResponse => appResponse.viewed
);

export const appResponseMessageSelector = createSelector(
  appResponseFeature,
  appResponse => appResponse.messages
);

export const userLocationFeature =
  createFeatureSelector<LocationDTO>(USER_LOCATION);

export const userLocationSelector = createSelector(
  userLocationFeature,
  userLocation => userLocation
);
