import { createReducer, on } from '@ngrx/store';
import { UserProfileStore } from '@app-core/user-profile-core/store/constants';
import {
  storeListedUsers,
  storeSocialsSuggestions,
  storeUserToken,
  storeUserInterests,
  storeUserProfile,
  storeUserProfileSocials,
  storeUserSearchResults,
  updateSocialsDisplay,
} from '@user-profile-core/store/user-profile-actions';

export const userProfileState: UserProfileStore = {
  userTokenDTO: null,
  userTokenDTOs: [],
  userSocials: [],
  socialsSuggestions: [],
  socialsDisplay: null,
  userSearch: [],
  userInterests: null,
  userProfile: null,
};

export const userProfileReducer = createReducer(
  userProfileState,
  on(storeUserToken, (state, { userTokenDTO }) => ({
    ...state,
    userTokenDTO: userTokenDTO,
  })),
  on(storeListedUsers, (state, { listedUsers }) => ({
    ...state,
    userTokenDTOs: listedUsers,
  })),
  on(storeUserProfile, (state, { userProfile }) => ({
    ...state,
    userProfile: userProfile,
  })),
  on(storeUserInterests, (state, { userInterests }) => ({
    ...state,
    userInterests: userInterests,
  })),
  on(storeUserProfileSocials, (state, { userSocials }) => ({
    ...state,
    userSocials: userSocials,
  })),
  on(storeSocialsSuggestions, (state, { socialsSuggestions }) => ({
    ...state,
    socialsSuggestions: [...socialsSuggestions],
  })),
  on(storeUserSearchResults, (state, { searchResults }) => ({
    ...state,
    userSearch: searchResults,
  })),
  on(updateSocialsDisplay, (state, { socialsDisplay }) => ({
    ...state,
    socialsDisplay: socialsDisplay,
  }))
);
