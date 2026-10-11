import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, concatMap, map } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  authenticateUserProfile,
  createUserTemporaryPassword,
  registerUserProfile,
  resetUserPassword,
} from '@auth-core/store';
import { setAuthenticationStatus } from '@app-store/app.actions';
import { AuthApiService } from '@auth-core/api/service/auth-api.service';
import { AuthService } from '@auth-core/auth-service';
import { ApiResponseService } from '@app-core/app-api';

@Injectable()
export class AuthEffects {
  public authenticateUserEffect = createEffect(() =>
    this.actions.pipe(
      ofType(authenticateUserProfile),
      concatMap(action =>
        this.authApiService.authenticateUserCredentials(action.logIn).pipe(
          map(authDTO => {
            this.authService.setClientTokens(authDTO);
            return setAuthenticationStatus({ authenticationStatus: true });
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public registerUserProfileEffect = createEffect(() =>
    this.actions.pipe(
      ofType(registerUserProfile),
      concatMap(action =>
        this.authApiService.registerUserProfile(action.signUp).pipe(
          map(authDTO => {
            this.authService.setClientTokens(authDTO);

            return setAuthenticationStatus({ authenticationStatus: true });
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public createTemporaryPasswordEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createUserTemporaryPassword),
      concatMap(action =>
        this.authApiService.createTemporaryPassword(action.userEmail).pipe(
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

  public createResetPasswordEffect = createEffect(() =>
    this.actions.pipe(
      ofType(resetUserPassword),
      concatMap(action =>
        this.authApiService.resetUserPassword(action.passwordReset).pipe(
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

  constructor(
    private actions: Actions,
    private authApiService: AuthApiService,
    private authService: AuthService,
    private apiResponseService: ApiResponseService
  ) {}
}
