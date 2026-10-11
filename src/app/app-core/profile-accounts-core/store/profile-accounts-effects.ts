import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileAccountsApiService } from '@profile-accounts-core/api/api-service/profile-accounts-api.service';
import { ApiResponseService } from '@app-core/app-api';
import {
  retrieveManagedProfiles,
  storeManagedProfiles,
  createProviderService,
  deleteProviderService,
  disableServiceProvider,
  registerBusinessProfile,
  retrieveFeatureServiceProviders,
  retrieveProviderSearchResults,
  retrieveServiceProvider,
  retrieveServiceProviders,
  retrieveStaffServiceProviders,
  storeProviderServices,
  storeProviderSearchResults,
  storeServiceProvider,
  storeServiceProviders,
  updateProviderService,
  updateBusinessProfileCategory,
  updateBusinessProfileBaseRate,
  retrieveBusinessProfile,
  storeBusinessProfile,
  retrieveUserEvents,
  storeUserEvents,
} from '@profile-accounts-core/store/profile-accounts-actions';
import { catchError, concatMap, map, mergeMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ProfileAccountsEffects {
  public retrieveManagedProfilesEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveManagedProfiles),
      concatMap(() =>
        this.profileAccountsApiService.retrieveManagedProfiles().pipe(
          map(managedProfiles =>
            storeManagedProfiles({ managedProfiles: managedProfiles })
          ),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public registerBusinessProfileEffect = createEffect(() =>
    this.actions.pipe(
      ofType(registerBusinessProfile),
      concatMap(action =>
        this.profileAccountsApiService
          .registerBusinessProfile(action.profileDTO)
          .pipe(
            mergeMap(successResponse => [
              retrieveBusinessProfile({
                profileDTO: action.profileDTO,
              }),

              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
            ]),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public disableServiceProviderEffect = createEffect(() =>
    this.actions.pipe(
      ofType(disableServiceProvider),
      concatMap(action =>
        this.profileAccountsApiService
          .disableBusinessProfile(action.profileDTO)
          .pipe(
            mergeMap(successResponse => [
              retrieveBusinessProfile({
                profileDTO: action.profileDTO,
              }),

              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
            ]),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveBusinessProfileEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveBusinessProfile),
      concatMap(action =>
        this.profileAccountsApiService
          .retrieveBusinessProfile(action.profileDTO)
          .pipe(
            map(businessProfile => storeBusinessProfile({ businessProfile })),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public updateProfileCategoryEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateBusinessProfileCategory),
      concatMap(action =>
        this.profileAccountsApiService
          .updateBusinessProfileCategory(action.businessProfile)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              storeBusinessProfile({ businessProfile: action.businessProfile }),
            ]),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public updateProfileBaseRateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateBusinessProfileBaseRate),
      concatMap(action =>
        this.profileAccountsApiService
          .updateBusinessProfileBaseRate(action.businessProfile)
          .pipe(
            mergeMap(successResponse => [
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse
              ),
              storeBusinessProfile({ businessProfile: action.businessProfile }),
            ]),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public createProviderServiceEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createProviderService),
      concatMap(action =>
        this.profileAccountsApiService
          .createProviderService(action.providerService)
          .pipe(
            map(response =>
              storeProviderServices({ profileServices: response })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public updateProviderServiceEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateProviderService),
      concatMap(action =>
        this.profileAccountsApiService
          .updateProviderService(action.providerService)
          .pipe(
            map(response =>
              storeProviderServices({ profileServices: response })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public deleteProviderServiceEffect = createEffect(() =>
    this.actions.pipe(
      ofType(deleteProviderService),
      concatMap(action =>
        this.profileAccountsApiService
          .deleteProviderService(action.providerService)
          .pipe(
            map(response =>
              storeProviderServices({ profileServices: response })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveServiceProvidersEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveServiceProviders),
      concatMap(action =>
        this.profileAccountsApiService
          .retrieveServiceProviders(action.locationCategories)
          .pipe(
            map(serviceProviders =>
              storeServiceProviders({ serviceProviders: serviceProviders })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveFeaturesServiceProvidersEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveFeatureServiceProviders),
      concatMap(action =>
        this.profileAccountsApiService
          .retrieveFeatureServiceProviders(action.locationCategories)
          .pipe(
            map(serviceProviders =>
              storeServiceProviders({
                serviceProviders: serviceProviders,
              })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveStaffServiceProvidersEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveStaffServiceProviders),
      concatMap(action =>
        this.profileAccountsApiService
          .retrieveStaffServiceProviders(action.locationCategories)
          .pipe(
            map(serviceProviders =>
              storeServiceProviders({
                serviceProviders: serviceProviders,
              })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveProviderSearchResultsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveProviderSearchResults),
      concatMap(action =>
        this.profileAccountsApiService
          .retrieveProviderSearchResults(action.searchDTO)
          .pipe(
            map(serviceProviders =>
              storeProviderSearchResults({ serviceProviders: serviceProviders })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveServiceProviderEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveServiceProvider),
      concatMap(action =>
        this.profileAccountsApiService
          .retrieveServiceProvider(action.profileDTO)
          .pipe(
            map(serviceProvider =>
              storeServiceProvider({ serviceProvider: serviceProvider })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveUserEventsEffects = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserEvents),
      concatMap(() =>
        this.profileAccountsApiService.retrieveUserEvents().pipe(
          map(userEvents => storeUserEvents({ userEvents: userEvents })),
          catchError((errorResponse: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(errorResponse)
          )
        )
      )
    )
  );

  constructor(
    private actions: Actions,
    private profileAccountsApiService: ProfileAccountsApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
