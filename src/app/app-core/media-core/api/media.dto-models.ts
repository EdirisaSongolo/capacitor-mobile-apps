import { Profiles } from '@domain-data-models/app-domain.enums';

export interface ProfileMediaFileDTO {
  mediaFileId: string;
  profile: string;
  profileId: string;
  mediaFileDesignation: string;
  mediaFileName: string;
  mediaFileUrl: string;
  mediaFileType: string;
  mediaFileFormat: string;
  mediaFileSize: string;
}

export interface CreateMediaDTO {
  profile: Profiles;
  profileId: string;
  mediaFiles: File[];
}

export interface MediaFilesDTO {
  profile: Profiles;
  profileId: string;
  mediaFiles: ProfileMediaFileDTO[];
}
