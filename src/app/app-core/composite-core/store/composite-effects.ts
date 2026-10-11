import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponseService } from '@app-core/app-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map } from 'rxjs';

import { CompositeApiService } from '@composite-core/api';
import {
  deleteSearchRecord,
  removeSearchRecord,
  retrieveSearchHistory,
  retrieveSearchResults,
  storeSearchHistory,
  storeSearchResults,
} from '@composite-core/store/composite-actions';

@Injectable()
export class CompositeEffects {
  public retrieveSearchHistoryEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveSearchHistory),
      concatMap(() =>
        this.compositeApiService.retrieveSearchHistory().pipe(
          map(response => storeSearchHistory({ searchRecords: response })),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public retrieveSearchResultsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveSearchResults),
      concatMap(action =>
        this.compositeApiService.retrieveSearchResults(action.search).pipe(
          map(response => storeSearchResults({ searchResults: response })),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public deleteSearchRecordEffect = createEffect(() =>
    this.actions.pipe(
      ofType(deleteSearchRecord),
      concatMap(action =>
        this.compositeApiService
          .deleteSearchRecord(action.resourceReference)
          .pipe(
            map(() =>
              removeSearchRecord({
                searchId: action.resourceReference.referenceId,
              })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  constructor(
    private actions: Actions,
    private compositeApiService: CompositeApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
