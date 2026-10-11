import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PublicEventsApiService } from '@public-events-core/api';
import { ApiResponseService } from '@app-core/app-api';
import {
  cancelPublicEventDate,
  cancelPublicEventFeature,
  cancelPublicEventLocation,
  createPublicEventProfile,
  createPublicEventDate,
  createPublicEventFeature,
  createPublicEventLocation,
  createPublicEventStaff,
  updateEventDateDetails,
  retrieveStaffLocationDates,
  retrievePublicEventDate,
  retrievePublicEventLocation,
  retrievePublicEventLocations,
  retrieveEventPrincipalProfile,
  setEventPrincipalProfile,
  setStaffLocationDates,
  setPublicEventDate,
  setPublicEventLocation,
  updateEventLocations,
  updatePublicEventDetails,
  updatePublicEventStaff,
  cancelPublicEvent,
  resetCreatePublicEventValues,
} from '@public-events-core/store/create-edit-event/create-edit-event.actions';
import { catchError, concatMap, map, mergeMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DashBordRoutes } from '@domain-data-models/dash-board.routes';

@Injectable()
export class CreateEditEventEffects {
  public createPublicEventEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPublicEventProfile),
      concatMap(action =>
        this.publicEventsApiService
          .createPublicEvent(action.createPublicEvent)
          .pipe(
            mergeMap(successResponse => [
              resetCreatePublicEventValues(),
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

  public updatePublicEventDetailsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updatePublicEventDetails),
      concatMap(action =>
        this.publicEventsApiService
          .updatePublicEventDetails(action.eventDetails)
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

  public cancelPublicEventEffect = createEffect(() =>
    this.actions.pipe(
      ofType(cancelPublicEvent),
      concatMap(action =>
        this.publicEventsApiService.cancelPublicEvent(action.profileDTO).pipe(
          map(successResponse => {
            const proceedTo: string[] = [
              `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.PUBLIC_EVENTS}`,
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

  public retrievePublicEventLocationsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePublicEventLocations),
      concatMap(action =>
        this.publicEventsApiService
          .retrievePublicEventLocations(action.profileDTO)
          .pipe(
            map(eventLocations =>
              updateEventLocations({ eventLocations: eventLocations })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePublicEventLocationEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePublicEventLocation),
      concatMap(action =>
        this.publicEventsApiService
          .retrievePublicEventLocation(action.eventComponent)
          .pipe(
            map(publicEventLocation =>
              setPublicEventLocation({
                publicEventLocation: publicEventLocation,
              })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public createPublicEventLocationEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPublicEventLocation),
      concatMap(action =>
        this.publicEventsApiService
          .createPublicEventLocation(action.createEventLocation)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePublicEventLocations({ profileDTO: action.profileDTO }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public deletePublicEventLocationEffect = createEffect(() =>
    this.actions.pipe(
      ofType(cancelPublicEventLocation),
      concatMap(action =>
        this.publicEventsApiService
          .cancelPublicEventLocation(action.eventComponent)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePublicEventLocations({ profileDTO: action.profileDTO }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePublicEventDateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePublicEventDate),
      concatMap(action =>
        this.publicEventsApiService
          .retrievePublicEventDate(action.eventComponent)
          .pipe(
            map(publicEventDate =>
              setPublicEventDate({ publicEventDate: publicEventDate })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public createPublicEventDateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPublicEventDate),
      concatMap(action =>
        this.publicEventsApiService
          .createPublicEventDate(action.createEventDate)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePublicEventLocation({
                eventComponent: action.eventComponent,
              }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public updateDateDetailsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateEventDateDetails),
      concatMap(action =>
        this.publicEventsApiService
          .updateEventDateDetails(action.dateDetails)
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

  public deletePublicEventDateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(cancelPublicEventDate),
      concatMap(action =>
        this.publicEventsApiService
          .cancelPublicEventDate(action.eventDate)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePublicEventLocation({
                eventComponent: action.dateLocation,
              }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public createPublicEventFeatureEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPublicEventFeature),
      concatMap(action =>
        this.publicEventsApiService
          .createPublicEventFeature(action.providerRequest)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePublicEventDate({ eventComponent: action.eventDate }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public cancelPublicEventFeatureEffect = createEffect(() =>
    this.actions.pipe(
      ofType(cancelPublicEventFeature),
      concatMap(action =>
        this.publicEventsApiService
          .cancelPublicEventFeature(action.providerRequest)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePublicEventDate({ eventComponent: action.eventDate }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveStaffLocationDatesEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveStaffLocationDates),
      concatMap(action =>
        this.publicEventsApiService
          .retrieveStaffLocationDates(action.eventProvider)
          .pipe(
            map(staffLocationDates =>
              setStaffLocationDates({ staffLocationDates: staffLocationDates })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public createPublicEventStaffEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPublicEventStaff),
      concatMap(action =>
        this.publicEventsApiService
          .createPublicEventStaff(action.providerRequests)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePublicEventLocation({
                eventComponent: action.eventLocation,
              }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public updatePublicEventStaffEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updatePublicEventStaff),
      concatMap(action =>
        this.publicEventsApiService
          .updatePublicEventStaff(action.providerRequests)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              retrievePublicEventLocation({
                eventComponent: action.eventLocation,
              }),
            ]),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePrincipalProfileEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveEventPrincipalProfile),
      concatMap(action =>
        this.publicEventsApiService
          .retrieveEventPrincipalProfile(action.profileDTO)
          .pipe(
            map(principalProfile =>
              setEventPrincipalProfile({ eventPrincipal: principalProfile })
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
    private publicEventsApiService: PublicEventsApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
