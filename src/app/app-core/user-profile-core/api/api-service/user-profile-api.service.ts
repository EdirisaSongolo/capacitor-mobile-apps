import { Injectable } from '@angular/core';
import { ApiService } from '@app-core/app-api';
import { Observable } from 'rxjs';
import {
  UserProfileDTO,
  UserProfileRestConstants,
  UserInterestsDTO,
  UserPasswordDTO,
  UserTokenDTO,
} from '@user-profile-core/api';
import { AuthDTO, AuthRestConstants } from '@auth-core/api';
import {
  ProfileDTO,
  ProfilesListDTO,
  SearchDTO,
  SuccessResponseDTO,
} from '@app-core/app-api/app-api.dto-models';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserProfileApiService {
  constructor(private apiService: ApiService) {}

  public retrieveUserProfileInfo(): Observable<UserProfileInfo> {
    const requestMapping = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.RETRIEVE_USER_PROFILE_INFO}`;
    return this.apiService.get<UserProfileInfo>(requestMapping);
  }

  public updateUserProfile(userProfile: UserProfileDTO): Observable<AuthDTO> {
    const requestMapping = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.UPDATE_USER_PROFILE}`;
    return this.apiService.post<AuthDTO>(requestMapping, userProfile);
  }

  public updateUserProfilePassword(
    userPasswordDTO: UserPasswordDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping = `${AuthRestConstants.AUTH}/${AuthRestConstants.UPDATE_USER_PASSWORD}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      userPasswordDTO
    );
  }

  public retrieveUserToken(profileDTO: ProfileDTO): Observable<UserTokenDTO> {
    const requestMapping = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.RETRIEVE_USER_TOKEN}`;
    return this.apiService.post<UserTokenDTO>(requestMapping, profileDTO);
  }

  public retrieveListedUsers(
    profilesList: ProfilesListDTO
  ): Observable<UserTokenDTO[]> {
    const requestMapping: string = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.RETRIEVE_LISTED_USERS}`;
    return this.apiService.post<UserTokenDTO[]>(requestMapping, profilesList);
  }

  public retrieveUserProfile(
    profileDTO: ProfileDTO
  ): Observable<UserProfileDTO> {
    const requestMapping = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.RETRIEVE_USER_PROFILE}`;
    return this.apiService.post<UserProfileDTO>(requestMapping, profileDTO);
  }

  public retrieveUserProfileInterests(): Observable<UserInterestsDTO> {
    const requestMapping = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.RETRIEVE_USER_PROFILE_INTERESTS}`;
    return this.apiService.get<UserInterestsDTO>(requestMapping);
  }

  public updateUserProfileInterests(
    userInterests: UserInterestsDTO
  ): Observable<UserInterestsDTO> {
    const requestMapping = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.UPDATE_USER_PROFILE_INTERESTS}`;
    return this.apiService.post<UserInterestsDTO>(
      requestMapping,
      userInterests
    );
  }

  public createFollowRequest(
    profileDTO: ProfileDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.CREATE_FOLLOWER_REQUEST}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, profileDTO);
  }

  public removeFollower(
    profileDTO: ProfileDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.REMOVE_FOLLOWER}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, profileDTO);
  }

  public retrieveUserProfileSocials(
    profile: ProfileDTO
  ): Observable<UserTokenDTO[]> {
    const requestMapping: string = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.RETRIEVE_USER_PROFILE_SOCIALS}`;
    return this.apiService.post<UserTokenDTO[]>(requestMapping, profile);
  }

  public retrieveSocialsSuggestions(
    profile: ProfileDTO
  ): Observable<UserTokenDTO[]> {
    const requestMapping: string = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.RETRIEVE_SOCIALS_SUGGESTIONS}`;
    return this.apiService.post<UserTokenDTO[]>(requestMapping, profile);
  }

  public retrieveUserSearchResults(
    searchDTO: SearchDTO
  ): Observable<UserTokenDTO[]> {
    const requestMapping: string = `${UserProfileRestConstants.USER_PROFILES}/${UserProfileRestConstants.RETRIEVE_USER_SEARCH_RESULTS}`;
    return this.apiService.post<UserTokenDTO[]>(requestMapping, searchDTO);
  }
}
