import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import {
  retrieveEventFeatures,
  retrieveEventGuests,
  retrievePrivateEventToken,
  retrieveUserInvitation,
  retrieveUserManagedPrivateEvents,
  retrieveUserPrivateEvent,
  retrieveUserPrivateEventToken,
  storeEventFeatures,
  storeEventGuests,
  storePrivateEvent,
  storeUserInvitation,
  storeUserManagedPrivateEvents,
  storeUserPrivateEvent,
  updateInvitationStatus,
} from '@private-events-core/store';
import { PrivateEventsApiService } from '@private-events-core/api';

import { ApiResponseService } from '@app-core/app-api';

import { UserEventAccess } from '@domain-data-models/app-domain.enums';
import { Router } from '@angular/router';
import { UserAccountRoutes } from '@user-profile-core/data-models';
import { setUserEvent } from '@profile-accounts-core/store';

@Injectable()
export class PrivateEventEffects {
  public retrievePrivateEventTokenEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePrivateEventToken),
      concatMap(action =>
        this.privateEventsApiService
          .retrievePrivateEventToken(action.profileDTO)
          .pipe(
            map(privateEvent =>
              storePrivateEvent({ privateEventToken: privateEvent })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveUserManagedPrivateEventsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserManagedPrivateEvents),
      concatMap(() =>
        this.privateEventsApiService.retrieveUserManagedPrivateEvents().pipe(
          map(privateEvents =>
            storeUserManagedPrivateEvents({ privateEvents: privateEvents })
          ),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public retrieveUserPrivateEventTokenEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserPrivateEventToken),
      concatMap(action =>
        this.privateEventsApiService
          .retrieveUserPrivateEventToken(action.profileDTO)
          .pipe(
            map(privateEvent => setUserEvent({ userEvent: privateEvent })),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveUserInvitation = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserInvitation),
      concatMap(action =>
        this.privateEventsApiService
          .retrieveUserInvitation(action.profileDTO)
          .pipe(
            map(invitation => storeUserInvitation({ invitation: invitation })),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public updateInvitationStatusEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateInvitationStatus),
      concatMap(action =>
        this.privateEventsApiService
          .updateInvitationStatus(action.inviteResponse)
          .pipe(
            map(successResponse => {
              const response = action.inviteResponse.response;
              const profileDTO = action.profileDTO;
              let proceedTo: string[] = [];

              if (response === UserEventAccess.confirmed) {
                proceedTo = [
                  UserAccountRoutes.USER_PRIVATE_EVENT,
                  profileDTO.profileId,
                ];
              } else if (response === UserEventAccess.declined) {
                proceedTo = [
                  `${UserAccountRoutes.HOME}/${UserAccountRoutes.USER_EVENTS}`,
                ];
              }

              return this.apiResponseService.createApiCallSuccessResponse(
                successResponse,
                proceedTo
              );
            }),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveUserPrivateEventEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserPrivateEvent),
      concatMap(action =>
        this.privateEventsApiService
          .retrieveUserPrivateEvent(action.profileDTO)
          .pipe(
            map(userPrivateEvent =>
              storeUserPrivateEvent({ userPrivateEvent: userPrivateEvent })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveEventGuestsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveEventGuests),
      concatMap(action =>
        this.privateEventsApiService
          .retrieveEventGuests(action.profileDTO)
          .pipe(
            map(eventGuests =>
              storeEventGuests({ eventGuests: [...eventGuests] })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveEventFeaturesEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveEventFeatures),
      concatMap(action =>
        this.privateEventsApiService
          .retrieveEventFeatures(action.profileDTO)
          .pipe(
            map(eventFeatures =>
              storeEventFeatures({ eventFeatures: [...eventFeatures] })
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
    private router: Router,
    private privateEventsApiService: PrivateEventsApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
