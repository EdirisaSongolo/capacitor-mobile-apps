import { ProfileDTO } from '@app-core/app-api';
import {
  CreateMediaDTO,
  MediaFilesDTO,
  ProfileMediaFileDTO,
} from '@app-core/media-core/api';
import { createAction, props } from '@ngrx/store';

export const UPDATE_PROFILE_IMAGE = '[Media Core] Update profile image';
export const updateProfileImage = createAction(
  UPDATE_PROFILE_IMAGE,
  props<{
    profile: ProfileDTO;
    profileImage: File;
  }>()
);

export const CREATE_PROFILE_MEDIA = '[Media core] Create profile media';
export const createProfileMedia = createAction(
  CREATE_PROFILE_MEDIA,
  props<{
    createMedia: CreateMediaDTO;
  }>()
);

export const RETRIEVE_PROFILE_MEDIA = '[Media core] Retrieve profile media';
export const retrieveProfileMedia = createAction(
  RETRIEVE_PROFILE_MEDIA,
  props<{ profile: ProfileDTO }>()
);

export const STORE_PROFILE_MEDIA = '[Media core] Store profile media';
export const storeProfileMedia = createAction(
  STORE_PROFILE_MEDIA,
  props<{
    profileMedia: ProfileMediaFileDTO[];
  }>()
);

export const REMOVE_PROFILE_MEDIA = '[Medaia core] Remove profile media';
export const removeProfileMedia = createAction(
  REMOVE_PROFILE_MEDIA,
  props<{ mediaFiles: MediaFilesDTO }>()
);
