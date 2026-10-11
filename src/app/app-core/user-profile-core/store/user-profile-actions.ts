import {
  UserProfileDTO,
  UserInterestsDTO,
  UserPasswordDTO,
  UserTokenDTO,
} from '@user-profile-core/api';
import { createAction, props } from '@ngrx/store';
import {
  ProfileDTO,
  ProfilesListDTO,
  SearchDTO,
} from '@app-core/app-api/app-api.dto-models';
import { SocialsDisplay } from '@user-profile-core/data-models';

export const RETRIEVE_USER_TOKEN = '[User Profile Core] Retrieves user token';
export const retrieveUserToken = createAction(
  RETRIEVE_USER_TOKEN,
  props<{ profile: ProfileDTO }>()
);

export const STORE_USER_TOKEN = '[User Profile Core] Store user token';
export const storeUserToken = createAction(
  STORE_USER_TOKEN,
  props<{ userTokenDTO: UserTokenDTO }>()
);

export const UPDATE_USER_PROFILE =
  '[User profile Dashboard] Update user profile';
export const updateUserProfile = createAction(
  UPDATE_USER_PROFILE,
  props<{ userProfile: UserProfileDTO }>()
);

export const UPDATE_USER_PASSWORD =
  '[User Profile Dashboard] Update user profile password';
export const updateUserPassword = createAction(
  UPDATE_USER_PASSWORD,
  props<{ userPasswordDTO: UserPasswordDTO }>()
);

export const UPDATE_USER_INTERESTS =
  '[User Profile Dashboard] Update user profile interests';
export const updateUserInterests = createAction(
  UPDATE_USER_INTERESTS,
  props<{ userInterests: UserInterestsDTO }>()
);

export const RETRIEVE_USER_INTERESTS =
  '[User Profile Dashboard] Retrieve user profile interests';
export const retrieveUserInterests = createAction(RETRIEVE_USER_INTERESTS);

export const STORE_USER_INTERESTS =
  '[User Profile Dashboard] Store user profile interests';
export const storeUserInterests = createAction(
  STORE_USER_INTERESTS,
  props<{
    userInterests: UserInterestsDTO;
  }>()
);

export const RETRIEVE_LISTED_USERS =
  '[Multiple Components] Retrieves the user DTOs of the listed user ids';
export const retrieveListedUsers = createAction(
  RETRIEVE_LISTED_USERS,
  props<{ profilesList: ProfilesListDTO }>()
);

export const STORE_LISTED_USERS =
  '[Multiple Components] Store retrieved users list';
export const storeListedUsers = createAction(
  STORE_LISTED_USERS,
  props<{ listedUsers: UserTokenDTO[] }>()
);

export const RETRIEVE_USER_PROFILE =
  '[User Profile Dashboard] Retrieve user profile dashboard';
export const retrieveUserProfile = createAction(
  RETRIEVE_USER_PROFILE,
  props<{ profileDTO: ProfileDTO }>()
);

export const STORE_USER_PROFILE = '[User Profile Dashboard] Store user profile';
export const storeUserProfile = createAction(
  STORE_USER_PROFILE,
  props<{ userProfile: UserProfileDTO }>()
);

export const FOLLOW_USER_PROFILE =
  '[User Profile Dashboard] Follow user profile';
export const followUserProfile = createAction(
  FOLLOW_USER_PROFILE,
  props<{
    profileDTO: ProfileDTO;
  }>()
);

export const UNFOLLOW_USER_PROFILE = '[User Profile] Unfollow user profile';
export const unfollowUserProfile = createAction(
  UNFOLLOW_USER_PROFILE,
  props<{
    profileDTO: ProfileDTO;
  }>()
);

export const RETRIEVE_USER_PROFILE_SOCIALS =
  '[User Profile Core], Retrieve user profile socials';
export const retrieveUserProfileSocials = createAction(
  RETRIEVE_USER_PROFILE_SOCIALS,
  props<{ profile: ProfileDTO }>()
);

export const STORE_USER_PROFILE_SOCIALS =
  '[User Profile Dashboard] Store user profile socials';
export const storeUserProfileSocials = createAction(
  STORE_USER_PROFILE_SOCIALS,
  props<{
    userSocials: UserTokenDTO[];
  }>()
);

export const RETRIEVE_SOCIALS_SUGGESTIONS =
  '[User Profile Core] Retrieve user socials suggestions';
export const retrieveSocialsSuggestions = createAction(
  RETRIEVE_SOCIALS_SUGGESTIONS,
  props<{ profile: ProfileDTO }>()
);

export const STORE_SOCIALS_SUGGESTIONS =
  '[User Profile Core] Store user socials suggestions';
export const storeSocialsSuggestions = createAction(
  STORE_SOCIALS_SUGGESTIONS,
  props<{ socialsSuggestions: UserTokenDTO[] }>()
);

export const RETRIEVE_USER_SEARCH_RESULTS =
  '[User Profile Core] Retrieve user search results';
export const retrieveUserSearchResults = createAction(
  RETRIEVE_USER_SEARCH_RESULTS,
  props<{ searchParam: SearchDTO }>()
);

export const STORE_USER_SEARCH_RESULTS =
  '[User Profile Core] Store user search results';
export const storeUserSearchResults = createAction(
  STORE_USER_SEARCH_RESULTS,
  props<{ searchResults: UserTokenDTO[] }>()
);

export const UPDATE_SOCIALS_DISPLAY = '[Dashboard] Update socials display';
export const updateSocialsDisplay = createAction(
  UPDATE_SOCIALS_DISPLAY,
  props<{
    socialsDisplay: SocialsDisplay;
  }>()
);
