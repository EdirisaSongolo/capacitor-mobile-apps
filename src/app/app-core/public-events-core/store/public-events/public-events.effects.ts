import { Injectable } from '@angular/core';
import { PublicEventsApiService } from '@public-events-core/api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map } from 'rxjs';
import {
  retrievePublicEvents,
  retrieveUserManagedPublicEvents,
  storeEventDatesTokens,
  storeEventLocationsTokens,
  storePublicEvents,
  retrieveEventLocationsTokens,
  retrieveEventDatesTokens,
  retrieveLocationDatesTokens,
  retrievePublicEventToken,
  storePublicEventToken,
  retrievePublicEventSearchResults,
  storePublicEventSearchResults,
  retrievePublicEventFeatures,
  storePublicEventFeatures,
  savePublicEventDate,
  retrievePublicEventPrincipal,
  storePublicEventPrincipal,
  purchasePublicEventTickets,
  retrieveEventDateProfile,
  storeEventDateProfile,
  retrieveDateEventToken,
  retrieveUserPublicEvent,
  storeUserPublicEvent,
} from '@public-events-core/store/public-events/public-events.actions';

import { ApiResponseService } from '@app-core/app-api';
import { HttpErrorResponse } from '@angular/common/http';
import { setUserEvent } from '@profile-accounts-core/store';
import { UserAccountRoutes } from '@user-profile-core/data-models';

@Injectable()
export class PublicEventEffects {
  public retrieveUserManagedPublicEventsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserManagedPublicEvents),
      concatMap(action =>
        this.publicEventsApiService.retrieveUserManagedPublicEvents()
      ),
      map(response => storePublicEvents({ publicEvents: response })),
      catchError((error, originalObservable) => originalObservable)
    )
  );

  public retrievePublicEvents = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePublicEvents),
      concatMap(action =>
        this.publicEventsApiService
          .retrievePublicEvents(action.locationCategories)
          .pipe(
            map(publicEvents =>
              storePublicEvents({ publicEvents: publicEvents })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePublicEventSearchResults = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePublicEventSearchResults),
      concatMap(action =>
        this.publicEventsApiService
          .retrievePublicEventSearchResults(action.searchDTO)
          .pipe(
            map(publicEvents =>
              storePublicEventSearchResults({ publicEvents: publicEvents })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePublicEventEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePublicEventToken),
      concatMap(action =>
        this.publicEventsApiService
          .retrievePublicEventToken(action.profileDTO)
          .pipe(
            map(publicEventToken =>
              storePublicEventToken({ publicEventToken: publicEventToken })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePublicEventLocationsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveEventLocationsTokens),
      concatMap(action =>
        this.publicEventsApiService
          .retrieveEventLocationsTokens(action.profileDTO)
          .pipe(
            map(response =>
              storeEventLocationsTokens({ locationsTokens: response })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePublicEventDates = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveEventDatesTokens),
      concatMap(action =>
        this.publicEventsApiService
          .retrieveEventDatesTokens(action.profile)
          .pipe(
            map(publicEventDates =>
              storeEventDatesTokens({ dateTokens: publicEventDates })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveEventLocationDates = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveLocationDatesTokens),
      concatMap(action =>
        this.publicEventsApiService
          .retrieveLocationDatesTokens(action.eventComponent)
          .pipe(
            map(publicEventDates =>
              storeEventDatesTokens({ dateTokens: publicEventDates })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveEventDateProfileEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveEventDateProfile),
      concatMap(action =>
        this.publicEventsApiService
          .retrieveEventDateProfile(action.eventComponent)
          .pipe(
            map(eventDateProfile =>
              storeEventDateProfile({ eventDateProfile: eventDateProfile })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePublicEventFeatures = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePublicEventFeatures),
      concatMap(action =>
        this.publicEventsApiService
          .retrievePublicEventFeatures(action.profile)
          .pipe(
            map(serviceProviders =>
              storePublicEventFeatures({ eventFeatures: serviceProviders })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrievePublicEventPrincipalEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrievePublicEventPrincipal),
      concatMap(action =>
        this.publicEventsApiService
          .retrievePublicEventPrincipal(action.profileDTO)
          .pipe(
            map(serviceProvider =>
              storePublicEventPrincipal({ eventPrincipal: serviceProvider })
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public savePublicEventDate = createEffect(() =>
    this.actions.pipe(
      ofType(savePublicEventDate),
      concatMap(action =>
        this.publicEventsApiService.savePublicEventDate(action.eventDate).pipe(
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

  public purchasePublicEventTicketsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(purchasePublicEventTickets),
      concatMap(action =>
        this.publicEventsApiService
          .purchasePublicEventTickets(action.paymentTransaction)
          .pipe(
            map(successResponse => {
              const proceedTo: string[] = [
                UserAccountRoutes.USER_PUBLIC_EVENT,
                action.eventComponent.componentId,
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

  public retrievetDateEventTokenEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveDateEventToken),
      concatMap(action =>
        this.publicEventsApiService
          .retrieveUserPublicEventToken(action.eventComponent)
          .pipe(
            map(userEvent => setUserEvent({ userEvent: userEvent })),
            catchError((errorResponse: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(errorResponse)
            )
          )
      )
    )
  );

  public retrieveUserPublicEventEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserPublicEvent),
      concatMap(action =>
        this.publicEventsApiService
          .retrieveUserPublicEvent(action.eventComponent)
          .pipe(
            map(userPublicEvent =>
              storeUserPublicEvent({ userPublicEvent: userPublicEvent })
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
