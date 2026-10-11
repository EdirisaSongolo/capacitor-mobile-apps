import { MediaStore } from '@media-core/store/constants';
import { createReducer, on } from '@ngrx/store';

import { storeProfileMedia } from '@media-core/store/media-actions';

export const mediaState: MediaStore = {
  profileMedia: [],
};

export const mediaReducer = createReducer(
  mediaState,
  on(storeProfileMedia, (state, { profileMedia }) => ({
    ...state,
    profileMedia,
  }))
);
