import { ProfileMediaFileDTO } from '@media-core/api/media.dto-models';

export const MEDIA = 'MEDIA';

export interface MediaStore {
  profileMedia: ProfileMediaFileDTO[];
}
