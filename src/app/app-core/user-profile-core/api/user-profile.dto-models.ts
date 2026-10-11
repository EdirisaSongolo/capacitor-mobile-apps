import { LocationDTO } from '@app-core/app-api';
import { ProviderDTO } from '@profile-accounts-core/api';

export interface UserTokenDTO extends ProviderDTO {
  userProfileId: string;
  firstName?: string;
  lastName?: string;
  userName: string;
  profileImage: string;
  userBiography?: string;
  followerStatus?: string;
  followingStatus?: string;
}

export interface UserSocialsDTO {
  userSocials: UserTokenDTO[];
  suggestions: UserTokenDTO[];
}

export interface UserProfileDTO {
  userProfileId: string;
  firstName: string;
  lastName: string;
  userName: string;
  profileImage?: string;
  emailAddress: string;
  biography?: string;
  userLocation?: LocationDTO;
}

export interface UserInterestsDTO {
  userProfileId: string;
  music: string;
  art: string;
  motorEvents: string;
  sports: string;
  familyEvents: string;
  fashion: string;
  academicEvents: string;
}

export interface UserPasswordDTO {
  currentUserPassword: string;
  newUserPassword: string;
}
