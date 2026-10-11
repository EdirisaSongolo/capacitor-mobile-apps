import { createFeatureSelector, createSelector } from '@ngrx/store';
import { COMPOSITE, CompositeStore } from '@composite-core/store/constants';

export const compositeFeature =
  createFeatureSelector<CompositeStore>(COMPOSITE);

export const searchHitorySelector = createSelector(
  compositeFeature,
  state => state.searchRecords
);

export const searchResultsSelector = createSelector(
  compositeFeature,
  state => state.searchResults
);
