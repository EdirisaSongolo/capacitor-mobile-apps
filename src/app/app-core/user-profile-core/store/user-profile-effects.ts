import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseService, SuccessResponseDTO } from '@app-core/app-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserProfileApiService } from '@user-profile-core/api';
import { AuthService } from '@auth-core/auth-service';
import { retrieveUserProfileInfo } from '@core-modules';
import { retrieveServiceProvider } from '@profile-accounts-core/store/profile-accounts-actions';
import {
  followUserProfile,
  retrieveListedUsers,
  retrieveSocialsSuggestions,
  retrieveUserToken,
  retrieveUserInterests,
  retrieveUserProfile,
  retrieveUserProfileSocials,
  retrieveUserSearchResults,
  storeListedUsers,
  storeSocialsSuggestions,
  storeUserToken,
  storeUserInterests,
  storeUserProfile,
  storeUserProfileSocials,
  storeUserSearchResults,
  unfollowUserProfile,
  updateUserInterests,
  updateUserPassword,
  updateUserProfile,
} from '@user-profile-core/store/user-profile-actions';
import { catchError, concatMap, map, mergeMap } from 'rxjs';

@Injectable()
export class UserProfileDashboardEffects {
  public retrieveUserTokenEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserToken),
      concatMap(action =>
        this.userProfileApiService.retrieveUserToken(action.profile).pipe(
          map(userTokenDTO => storeUserToken({ userTokenDTO })),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public updateUserProfileEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateUserProfile),
      concatMap(action =>
        this.userProfileApiService.updateUserProfile(action.userProfile).pipe(
          mergeMap(authDTO => {
            this.authService.setClientTokens(authDTO);

            const successResponse: SuccessResponseDTO =
              this.apiResponseService.createSuccessResponse(
                'user-profile-dashboard.api-responses.user-details-updated'
              );

            return [
              retrieveUserProfileInfo(),
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
            ];
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public updateUserProfilePasswordEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateUserPassword),
      concatMap(action =>
        this.userProfileApiService
          .updateUserProfilePassword(action.userPasswordDTO)
          .pipe(
            map(successResponse =>
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              )
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveUserProfileInterestsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserInterests),
      concatMap(() =>
        this.userProfileApiService.retrieveUserProfileInterests().pipe(
          map(userInterests => storeUserInterests({ userInterests })),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public updateUserProfileInterestsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateUserInterests),
      concatMap(action =>
        this.userProfileApiService
          .updateUserProfileInterests(action.userInterests)
          .pipe(
            map(userInterests => storeUserInterests({ userInterests })),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveListedUsersEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveListedUsers),
      concatMap(action =>
        this.userProfileApiService
          .retrieveListedUsers(action.profilesList)
          .pipe(
            map(usersList => storeListedUsers({ listedUsers: usersList })),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveUserProfileEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserProfile),
      concatMap(action =>
        this.userProfileApiService.retrieveUserProfile(action.profileDTO).pipe(
          map(userProfile => storeUserProfile({ userProfile })),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public createFollowRequestEffect = createEffect(() =>
    this.actions.pipe(
      ofType(followUserProfile),
      concatMap(action =>
        this.userProfileApiService.createFollowRequest(action.profileDTO).pipe(
          mergeMap(successResponse => [
            retrieveServiceProvider({ profileDTO: action.profileDTO }),
            this.apiResponseService.createApiCallSuccessResponse(
              successResponse
            ),
          ]),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public removeFollowerEffect = createEffect(() =>
    this.actions.pipe(
      ofType(unfollowUserProfile),
      concatMap(action =>
        this.userProfileApiService.removeFollower(action.profileDTO).pipe(
          mergeMap(successResponse => [
            retrieveServiceProvider({ profileDTO: action.profileDTO }),
            this.apiResponseService.createApiCallSuccessResponse(
              successResponse
            ),
          ]),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public retrieveUserProfileSocialsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserProfileSocials),
      concatMap(action =>
        this.userProfileApiService
          .retrieveUserProfileSocials(action.profile)
          .pipe(
            map(socials => storeUserProfileSocials({ userSocials: socials })),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveSocialsSuggestionsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveSocialsSuggestions),
      concatMap(action =>
        this.userProfileApiService
          .retrieveSocialsSuggestions(action.profile)
          .pipe(
            map(users =>
              storeSocialsSuggestions({ socialsSuggestions: users })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveUserSearchResultsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserSearchResults),
      concatMap(action =>
        this.userProfileApiService
          .retrieveUserSearchResults(action.searchParam)
          .pipe(
            map(searchResults =>
              storeUserSearchResults({ searchResults: searchResults })
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
    private userProfileApiService: UserProfileApiService,
    private apiResponseService: ApiResponseService,
    private authService: AuthService
  ) {}
}
