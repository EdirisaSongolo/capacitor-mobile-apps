import { createReducer, on } from '@ngrx/store';
import {
  createAppResponse,
  setAuthenticationStatus,
  setUserProfileInfo,
  updateUserLocation,
  updateUserProfileImage,
} from '@app-store/app.actions';
import {
  AppResponse,
  UserProfileInfo,
} from '@app-core/app-domain/domain-data-models';
import { LocationDTO } from '@app-core/app-api/app-api.dto-models';

export const authenticationStatus: boolean = false;

export const authenticationStatusReducer = createReducer(
  authenticationStatus,
  on(
    setAuthenticationStatus,
    (authenticationStatusState, { authenticationStatus }) =>
      (authenticationStatusState = authenticationStatus)
  )
);

export const userProfileInfo: UserProfileInfo = {
  userProfileId: null,
  firstName: null,
  lastName: null,
  userName: null,
  profileImage: null,
  userBiography: null,
};

export const userProfileInfoReducer = createReducer(
  userProfileInfo,
  on(setUserProfileInfo, (state, { userProfileInfo }) => userProfileInfo),
  on(updateUserProfileImage, (state, { mediaFileUrl }) => ({
    ...state,
    profileImage: mediaFileUrl,
  }))
);

export const appResponseState: AppResponse = {
  viewed: true,
  type: null,
  messages: [],
};

export const appResponseReducer = createReducer(
  appResponseState,
  on(
    createAppResponse,
    (appResponseState, { appResponse }) => (appResponseState = appResponse)
  )
);

export const userLocation: LocationDTO = {
  address: null,
  city: null,
  state: null,
  country: null,
  postalCode: null,
  latitude: null,
  longitude: null,
};

export const userLocationReducer = createReducer(
  userLocation,
  on(
    updateUserLocation,
    (currentLocation, { userLocation }) => (currentLocation = userLocation)
  )
);
