import { createAction, props } from '@ngrx/store';
import {
  ProfileTokenDTO,
  ResourceReferenceDTO,
  SearchDTO,
} from '@app-core/app-api';
import { SearchRecord } from '@composite-core/api/composite.dto-models';

export const RETRIEVE_SEARCH_HISTORY: string =
  '[Search] Retrieve search history';
export const retrieveSearchHistory = createAction(RETRIEVE_SEARCH_HISTORY);

export const STORE_SEARCH_HISTORY: string =
  '[Composite Core] Store search history';
export const storeSearchHistory = createAction(
  STORE_SEARCH_HISTORY,
  props<{ searchRecords: SearchRecord[] }>()
);

export const RETRIEVE_SEARCH_RESULTS: string =
  '[Search] Retrieve search results';
export const retrieveSearchResults = createAction(
  RETRIEVE_SEARCH_RESULTS,
  props<{ search: SearchDTO }>()
);

export const STORE_SEARCH_RESULTS: string =
  '[Composite Core] Store search results';
export const storeSearchResults = createAction(
  STORE_SEARCH_RESULTS,
  props<{ searchResults: ProfileTokenDTO[] }>()
);

export const DELETE_SEARCH_RECORD: string = '[Search] Delete search record';
export const deleteSearchRecord = createAction(
  DELETE_SEARCH_RECORD,
  props<{ resourceReference: ResourceReferenceDTO }>()
);

export const REMOVE_SEARCH_RECORD: string =
  '[Composite Core] Remove search record';
export const removeSearchRecord = createAction(
  REMOVE_SEARCH_RECORD,
  props<{ searchId: string }>()
);
