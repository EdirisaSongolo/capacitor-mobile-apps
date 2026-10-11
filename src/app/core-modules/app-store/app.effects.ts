import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserProfileApiService } from '@user-profile-core/api';
import {
  retrieveUserProfileInfo,
  setUserProfileInfo,
} from '@app-store/app.actions';
import { map, concatMap, catchError } from 'rxjs';
import { ApiResponseService } from '@app-core/app-api';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ApplicationEffects {
  public retrieveUserProfileInfo = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserProfileInfo),
      concatMap(() =>
        this.userProfileApiService.retrieveUserProfileInfo().pipe(
          map(userProfileInfo =>
            setUserProfileInfo({ userProfileInfo: userProfileInfo })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            return this.apiResponseService.createApiCallErrorResponse(
              errorResponse
            );
          })
        )
      )
    )
  );

  constructor(
    private actions: Actions,
    private userProfileApiService: UserProfileApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
