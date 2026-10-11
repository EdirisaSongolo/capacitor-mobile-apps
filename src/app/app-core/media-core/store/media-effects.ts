import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createProfileMedia,
  removeProfileMedia,
  retrieveProfileMedia,
  storeProfileMedia,
  updateProfileImage,
} from '@media-core/store/media-actions';
import { catchError, concatMap, map, mergeMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponseService } from '@app-core/app-api';
import { MediaApiService } from '@media-core/api/api-service/media-api.service';
import { ProfileImageService } from '@media-core/services/profile-image/profile-image.service';

@Injectable()
export class MediaEffects {
  public updateProfileImageEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateProfileImage),
      concatMap(action =>
        this.mediaApiService
          .updateProfileImage(action.profile, action.profileImage)
          .pipe(
            mergeMap(respone =>
              this.profileImageService.successfullyUpdatedProfileImage(respone)
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public createProfileMediaEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createProfileMedia),
      concatMap(action =>
        this.mediaApiService.createProfileMedia(action.createMedia).pipe(
          map(profileMediaFiles =>
            storeProfileMedia({ profileMedia: profileMediaFiles })
          ),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public retrieveProfileMediaEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveProfileMedia),
      concatMap(action =>
        this.mediaApiService.retrieveProfileMedia(action.profile).pipe(
          map(profileMediaFiles =>
            storeProfileMedia({ profileMedia: profileMediaFiles })
          ),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public removeProfileMediaEffect = createEffect(() =>
    this.actions.pipe(
      ofType(removeProfileMedia),
      concatMap(action =>
        this.mediaApiService.removeProfileMedia(action.mediaFiles).pipe(
          map(profileMediaFiles =>
            storeProfileMedia({ profileMedia: profileMediaFiles })
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
    private mediaApiService: MediaApiService,
    private apiResponseService: ApiResponseService,
    private profileImageService: ProfileImageService
  ) {}
}
