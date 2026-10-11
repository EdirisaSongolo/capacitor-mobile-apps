import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  USER_PROFILES,
  UserProfileStore,
} from '@app-core/user-profile-core/store/constants';

export const userProfileFeature =
  createFeatureSelector<UserProfileStore>(USER_PROFILES);

export const userTokenDTOSelctor = createSelector(
  userProfileFeature,
  state => state?.userTokenDTO
);

export const userTokenDTOsSelector = createSelector(
  userProfileFeature,
  state => state?.userTokenDTOs
);

export const userSocialsSelector = createSelector(
  userProfileFeature,
  state => state.userSocials
);

export const socialsSuggestionsSelector = createSelector(
  userProfileFeature,
  state => state.socialsSuggestions
);

export const userSearchSelector = createSelector(
  userProfileFeature,
  state => state.userSearch
);

export const userInterestsSelector = createSelector(
  userProfileFeature,
  state => state?.userInterests
);

export const userProfileSelector = createSelector(
  userProfileFeature,
  state => state?.userProfile
);

export const socialsDisplaySelector = createSelector(
  userProfileFeature,
  state => state?.socialsDisplay
);
