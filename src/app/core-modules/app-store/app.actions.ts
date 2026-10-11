import { createAction, props } from '@ngrx/store';
import {
  AppResponse,
  UserProfileInfo,
} from '@domain-data-models/app-domain.interfaces';
import { LocationDTO } from '@app-core/app-api/app-api.dto-models';

export const SET_AUTHENTICATION_STATUS: string = '[App] Set client access';
export const setAuthenticationStatus = createAction(
  SET_AUTHENTICATION_STATUS,
  props<{ authenticationStatus: boolean }>()
);

export const RETRIEVE_USER_PROFILE_INFO: string =
  '[App] Retrieve user profile info';
export const retrieveUserProfileInfo = createAction(RETRIEVE_USER_PROFILE_INFO);

export const SET_USER_PROFILE_INFO: string = '[App] Set user profile info';
export const setUserProfileInfo = createAction(
  SET_USER_PROFILE_INFO,
  props<{ userProfileInfo: UserProfileInfo }>()
);

export const UPDATE_USER_PROFILE_IMAGE =
  '[User Profile Dashboard] Update user profile image';
export const updateUserProfileImage = createAction(
  UPDATE_USER_PROFILE_IMAGE,
  props<{ mediaFileUrl: string }>()
);

export const CREATE_APP_RESPONSE = '[App] Create app response';
export const createAppResponse = createAction(
  CREATE_APP_RESPONSE,
  props<{ appResponse: AppResponse }>()
);

export const UPDATE_USER_LOCATION = '[App] Update user location';
export const updateUserLocation = createAction(
  UPDATE_USER_LOCATION,
  props<{ userLocation: LocationDTO }>()
);

export const LOGOUT = '[App] Logout';
export const logout = createAction(LOGOUT);
