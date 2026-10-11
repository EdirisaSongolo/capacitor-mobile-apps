import { Injectable } from '@angular/core';
import { ApiService, ProfileDTO } from '@app-core/app-api';
import { Observable } from 'rxjs';
import {
  MediaRestConstants,
  ProfileMediaFileDTO,
  CreateMediaDTO,
  MediaFilesDTO,
} from '@media-core/api';

@Injectable({
  providedIn: 'root',
})
export class MediaApiService {
  constructor(private apiService: ApiService) {}

  public updateProfileImage(
    profileDTO: ProfileDTO,
    profileImage: File
  ): Observable<ProfileMediaFileDTO> {
    const requestMapping: string = `${MediaRestConstants.MEDIA}/${MediaRestConstants.UPDATE_PROFILE_IMAGE}`;

    const profileImageForm = new FormData();
    profileImageForm.append('profile', profileDTO.profile);
    profileImageForm.append('profileId', profileDTO.profileId);
    profileImageForm.append('profileImage', profileImage);

    return this.apiService.multiPartPost<ProfileMediaFileDTO>(
      requestMapping,
      profileImageForm
    );
  }

  public createProfileMedia(
    profileMediaFiles: CreateMediaDTO
  ): Observable<ProfileMediaFileDTO[]> {
    const requestMapping: string = `${MediaRestConstants.MEDIA}/${MediaRestConstants.CREATE_PROFILE_MEDIA}`;

    const profileMediaForm = new FormData();
    const mediaFiles: File[] = profileMediaFiles.mediaFiles;

    profileMediaForm.append('profile', profileMediaFiles.profile);
    profileMediaForm.append('profileId', profileMediaFiles.profileId);
    mediaFiles.forEach(file =>
      profileMediaForm.append('profileMedia', file, file.name)
    );

    return this.apiService.multiPartPost<ProfileMediaFileDTO[]>(
      requestMapping,
      profileMediaForm
    );
  }

  public retrieveProfileMedia(
    profileDTO: ProfileDTO
  ): Observable<ProfileMediaFileDTO[]> {
    const requestMapping: string = `${MediaRestConstants.MEDIA}/${MediaRestConstants.RETRIEVE_PROFILE_MEDIA}`;
    return this.apiService.post<ProfileMediaFileDTO[]>(
      requestMapping,
      profileDTO
    );
  }

  public removeProfileMedia(
    profileMediaFiles: MediaFilesDTO
  ): Observable<ProfileMediaFileDTO[]> {
    const requestMapping: string = `${MediaRestConstants.MEDIA}/${MediaRestConstants.REMOVE_PROFILE_MEDIA}`;

    return this.apiService.post<ProfileMediaFileDTO[]>(
      requestMapping,
      profileMediaFiles
    );
  }
}
