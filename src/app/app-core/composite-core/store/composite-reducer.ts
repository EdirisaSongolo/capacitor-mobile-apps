import { createReducer, on } from '@ngrx/store';
import { CompositeStore } from '@composite-core/store/constants';
import {
  removeSearchRecord,
  retrieveSearchResults,
  storeSearchHistory,
  storeSearchResults,
} from '@composite-core/store/composite-actions';

export const compositeState: CompositeStore = {
  searchRecords: [],
  searchResults: [],
};

export const compositeReducer = createReducer(
  compositeState,
  on(storeSearchHistory, (state, { searchRecords }) => ({
    ...state,
    searchRecords: searchRecords,
  })),
  on(retrieveSearchResults, (state): CompositeStore => ({
    ...state,
    searchResults: [],
  })),
  on(storeSearchResults, (state, { searchResults }) => ({
    ...state,
    searchResults: searchResults,
  })),
  on(removeSearchRecord, (state, { searchId }) => ({
    ...state,
    searchRecords: state.searchRecords.filter(
      searchRecord => searchRecord.searchId !== searchId
    ),
  }))
);
