import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap } from 'rxjs';
import { VenuesApiService } from '@venues-core/api';
import {
  createVenueProfile,
  retrieveUserManagedVenues,
  storeUserManagedVenues,
  retrieveLocationVenues,
  storeLocationVenues,
  updateVenueProfileDetails,
  createVenueProfileManager,
  removeVenueProfileManagers,
  storeVenueProfileManagers,
  retrieveVenueSearchResults,
  storeVenueSearchResults,
  retrieveVenueToken,
  storeVenueToken,
  retrieveVenueProfileManagers,
} from '@venues-core/store/venues-actions';

import { ApiResponseService, SuccessResponseDTO } from '@app-core/app-api';
import { HttpErrorResponse } from '@angular/common/http';
import { DashBordRoutes } from '@domain-data-models/dash-board.routes';

@Injectable()
export class VenuesEffects {
  public createVenueProfileAccountEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createVenueProfile),
      concatMap(action =>
        this.venuesApiService.createVenueProfileAccount(action.venueDTO).pipe(
          mergeMap(venueDTO => {
            const successResponse: SuccessResponseDTO =
              this.apiResponseService.createSuccessResponse(
                'venues-dashboard.api-responses.venue-profile-created'
              );

            const proceedTo: string[] = [
              `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.VENUES}/${DashBordRoutes.PROFILE}/${venueDTO.venueProfileId}`,
            ];
            return [
              storeVenueToken({ venue: venueDTO }),
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse,
                proceedTo
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

  public updateVenueProfileDetailsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateVenueProfileDetails),
      concatMap(action =>
        this.venuesApiService.updateVenueProfileDetails(action.venueDTO).pipe(
          mergeMap(venueProfile => {
            const successResponse: SuccessResponseDTO =
              this.apiResponseService.createSuccessResponse(
                'venues-dashboard.api-responses.venue-profile-updated'
              );

            return [
              storeVenueToken({ venue: venueProfile }),
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

  public retrieveVenueEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveVenueToken),
      concatMap(action =>
        this.venuesApiService.retrieveVenue(action.profile).pipe(
          map(venue => storeVenueToken({ venue: venue })),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public retrieveLocationVenuesEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveLocationVenues),
      concatMap(action =>
        this.venuesApiService.retrieveLocationVenues(action.locationCategories)
      ),
      map(venues => storeLocationVenues({ venues: venues })),
      catchError((error, originalObservable) => originalObservable)
    )
  );

  public retrieveUserManagedVenuesEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserManagedVenues),
      concatMap(action => this.venuesApiService.retrieveUserManagedVenues()),
      map(results => storeUserManagedVenues({ managedVenues: results })),
      catchError((error, originalObservable) => originalObservable)
    )
  );

  public createVenueManagerEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createVenueProfileManager),
      concatMap(action =>
        this.venuesApiService.createVenueManager(action.venueManager).pipe(
          map(venueManagement =>
            storeVenueProfileManagers({ venueManagers: venueManagement })
          ),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public retrieveVenueManagersEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveVenueProfileManagers),
      concatMap(action =>
        this.venuesApiService.retrieveVenueManagers(action.profile).pipe(
          map(venueManagers =>
            storeVenueProfileManagers({ venueManagers: venueManagers })
          ),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public removeVenueManagersEffect = createEffect(() =>
    this.actions.pipe(
      ofType(removeVenueProfileManagers),
      concatMap(action =>
        this.venuesApiService.removeVenueManagement(action.venueManagers).pipe(
          map(venueManagement =>
            storeVenueProfileManagers({ venueManagers: venueManagement })
          ),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  public retrieveVenueSearchResults = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveVenueSearchResults),
      concatMap(action =>
        this.venuesApiService
          .retrieveVenueSearchResults(action.searchParam)
          .pipe(
            map(searchResults =>
              storeVenueSearchResults({ searchResults: searchResults })
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
    private venuesApiService: VenuesApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
