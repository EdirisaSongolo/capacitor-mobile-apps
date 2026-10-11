import { Injectable } from '@angular/core';
import { catchError, concatMap, map, mergeMap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';

import { ApiResponseService, ProfileDTO } from '@app-core/app-api';
import { Profiles } from '@domain-data-models/app-domain.enums';
import { DashBordRoutes } from '@domain-data-models/dash-board.routes';
import { PrivateEventsApiService } from '@private-events-core/api';
import { retrievePrivateEventToken } from '@private-events-core/store/private-events/private-events.actions';

import {
  cancelPrivateEvent,
  cancelPrivateEventFeature,
  cancelPrivateEventStaff,
  createPrivateEventFeature,
  createPrivateEventGuest,
  createPrivateEventProfile,
  createPrivateEventStaff,
  resetCreatePrivateEventValues,
  retrievePrivateEventFeatures,
  retrievePrivateEventGuests,
  retrievePrivateEventLocation,
  retrievePrivateEventStaff,
  removePrivateEventGuest,
  setPrivateEventLocation,
  storePrivateEventFeatures,
  updatePrivateEventDetails,
  updatePrivateEventGuests,
  updatePrivateEventLocation,
  updatePrivateEventStaff,
} from '@private-events-core/store/create-edit-event/create-edit-event.actions';

@Injectable()
export class CreateEditEventEffects {
  public createPrivateEventEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPrivateEventProfile),
      concatMap(action =>
        this.privateEventsApiService
          .createPrivateEventProfile(action.createPrivateEvent)
          .pipe(
            mergeMap(successResponse => [
              resetCreatePrivateEventValues(),
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

  public updatePrivateEventDetailsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updatePrivateEventDetails),
      concatMap(action =>
        this.privateEventsApiService
          .updatePrivateEventDetails(action.eventUpdateDTO)
          .pipe(
            mergeMap(successResponse => {
              const profileDTO: ProfileDTO = {
                profile: Profiles.privateEventProfile,
                profileId: action.eventUpdateDTO.eventId,
              };

              return [
                this.apiResponseService.createApiCallSuccessResponse(
                  successResponse
                ),
                retrievePrivateEventToken({ profileDTO: profileDTO }),
              ];
            }),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public cancelPrivateEventEffect = createEffect(() =>
    this.actions.pipe(
      ofType(cancelPrivateEvent),
      concatMap(action =>
        this.privateEventsApiService.cancelPrivateEvent(action.profileDTO).pipe(
          map(successResponse => {
            const proceedTo: string[] = [
              `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.PRIVATE_EVENTS}`,
            ];

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

  public retrievePrivateEventLocationEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePrivateEventLocation),
      concatMap(action =>
        this.privateEventsApiService
          .retrievePrivateEventLocation(action.profileDTO)
          .pipe(
            map(privateEventLocation =>
              setPrivateEventLocation({ eventLocation: privateEventLocation })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public updatePrivateEventLocationEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updatePrivateEventLocation),
      concatMap(action =>
        this.privateEventsApiService
          .updatePrivateEventLocation(action.eventLocation)
          .pipe(
            mergeMap(successResponse => {
              const profileDTO: ProfileDTO = {
                profile: Profiles.privateEventProfile,
                profileId: action.eventLocation.eventId,
              };

              return [
                this.apiResponseService.createApiCallSuccessResponse(
                  successResponse
                ),
                retrievePrivateEventLocation({ profileDTO: profileDTO }),
              ];
            }),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePrivateEventFeaturesEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePrivateEventFeatures),
      concatMap(action =>
        this.privateEventsApiService
          .retrievePrivateEventFeatures(action.profileDTO)
          .pipe(
            map(eventFeatures =>
              storePrivateEventFeatures({ eventFeatures: eventFeatures })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public createPrivateEventFeatureEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPrivateEventFeature),
      concatMap(action =>
        this.privateEventsApiService
          .createPrivateEventFeature(action.providerRequest)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePrivateEventFeatures({ profileDTO: action.profileDTO }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public cancelPrivateEventFeatureEffect = createEffect(() =>
    this.actions.pipe(
      ofType(cancelPrivateEventFeature),
      concatMap(action =>
        this.privateEventsApiService
          .cancelPrivateEventFeature(action.providerRequest)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePrivateEventFeatures({ profileDTO: action.profileDTO }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePrivateEventStaffEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePrivateEventStaff),
      concatMap(action =>
        this.privateEventsApiService
          .retrievePrivateEventStaff(action.profileDTO)
          .pipe(
            map(privateEventStaff =>
              updatePrivateEventStaff({ eventStaff: privateEventStaff })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public createPrivateEventStaffEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPrivateEventStaff),
      concatMap(action =>
        this.privateEventsApiService
          .createPrivateEventStaff(action.providerRequest)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePrivateEventStaff({ profileDTO: action.profileDTO }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public cancelPrivateEventStaffEffect = createEffect(() =>
    this.actions.pipe(
      ofType(cancelPrivateEventStaff),
      concatMap(action =>
        this.privateEventsApiService
          .cancelPrivateEventStaff(action.providerRequest)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePrivateEventStaff({ profileDTO: action.profileDTO }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePrivateEventGuestsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePrivateEventGuests),
      concatMap(action =>
        this.privateEventsApiService
          .retrievePrivateEventGuests(action.profileDTO)
          .pipe(
            map(privateEventGuests =>
              updatePrivateEventGuests({ eventGuests: privateEventGuests })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public createPrivateEventGuestEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPrivateEventGuest),
      concatMap(action =>
        this.privateEventsApiService
          .createPrivateEventGuest(action.eventGuest)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePrivateEventGuests({ profileDTO: action.profileDTO }),
            ]),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public removePrivateEventGuestEffect = createEffect(() =>
    this.actions.pipe(
      ofType(removePrivateEventGuest),
      concatMap(action =>
        this.privateEventsApiService
          .removePrivateEventGuest(action.eventGuest)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePrivateEventGuests({ profileDTO: action.profileDTO }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  constructor(
    private actions: Actions,
    private privateEventsApiService: PrivateEventsApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
