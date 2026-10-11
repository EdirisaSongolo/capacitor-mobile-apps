import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MEDIA, MediaStore } from '@media-core/store/constants';

export const MediaFeature = createFeatureSelector<MediaStore>(MEDIA);

export const profileMediaSelector = createSelector(
  MediaFeature,
  state => state.profileMedia
);
