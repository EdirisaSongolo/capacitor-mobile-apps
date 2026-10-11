import {
  UserProfileDTO,
  UserInterestsDTO,
  UserTokenDTO,
} from '@user-profile-core/api';
import { SocialsDisplay } from '@user-profile-core/data-models';

export const USER_PROFILES = 'User Profiles';

export interface UserProfileStore {
  userTokenDTO: UserTokenDTO;
  userTokenDTOs: UserTokenDTO[];
  userSocials: UserTokenDTO[];
  socialsSuggestions: UserTokenDTO[];
  socialsDisplay: SocialsDisplay;
  userSearch: UserTokenDTO[];
  userInterests: UserInterestsDTO | null;
  userProfile: UserProfileDTO | null;
}
