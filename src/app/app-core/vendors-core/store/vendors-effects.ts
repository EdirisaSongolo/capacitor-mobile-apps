import { Injectable } from '@angular/core';
import { VendorsApiService } from '@vendors-core/api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createVendorProfileManager,
  createVendorProfile,
  removeVendorProfileManagers,
  retrieveUserManagedVendors,
  storeVendorProfileManagers,
  updateVendorProfileDetails,
  retrieveVendorToken,
  storeVendorToken,
  retrieveVendorProfileManagers,
  storeUserManagedVendors,
} from '@vendors-core/store';
import { catchError, concatMap, map, mergeMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponseService, SuccessResponseDTO } from '@app-core/app-api';
import { DashBordRoutes } from '@domain-data-models/dash-board.routes';

@Injectable()
export class VendorsEffects {
  public retrieveManagedVendorsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserManagedVendors),
      concatMap(() =>
        this.vendorsApiService.retrieveUserManagedVendors().pipe(
          map(managedVendors =>
            storeUserManagedVendors({ managedVendors: managedVendors })
          ),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public createVendorEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createVendorProfile),
      concatMap(action =>
        this.vendorsApiService.createVendorProfile(action.vendorDTO).pipe(
          mergeMap(vendor => {
            const successResponse: SuccessResponseDTO =
              this.apiResponseService.createSuccessResponse(
                'vendors-dashboard.api-responses.vendor-profile-created'
              );

            const proceedTo: string[] = [
              `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.VENDORS}/${DashBordRoutes.PROFILE}/${vendor.vendorProfileId}`,
            ];
            return [
              storeVendorToken({ vendor: vendor }),
              this.apiResponseService.createApiCallSuccessResponse(
                successResponse,
                proceedTo
              ),
            ];
          }),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public updateVendorProfileDetailsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateVendorProfileDetails),
      concatMap(action =>
        this.vendorsApiService
          .updateVendorProfileDetails(action.vendorDTO)
          .pipe(
            mergeMap(vendor => {
              const successResponse: SuccessResponseDTO =
                this.apiResponseService.createSuccessResponse(
                  'vendors-dashboard.api-responses.vendor-profile-updated'
                );

              return [
                storeVendorToken({ vendor: vendor }),
                this.apiResponseService.createApiCallSuccessResponse(
                  successResponse
                ),
              ];
            }),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveVendorEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveVendorToken),
      concatMap(action =>
        this.vendorsApiService.retrieveVendor(action.profile).pipe(
          map(vendor => storeVendorToken({ vendor: vendor })),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public createVendorManagerEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createVendorProfileManager),
      concatMap(action =>
        this.vendorsApiService.createVendorManager(action.vendorManager).pipe(
          map(vendorManagement =>
            storeVendorProfileManagers({ vendorManagers: vendorManagement })
          ),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public retrieveVendorManagersEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveVendorProfileManagers),
      concatMap(action =>
        this.vendorsApiService.retrieveVendorManagers(action.profile).pipe(
          map(vendorManagers =>
            storeVendorProfileManagers({ vendorManagers: vendorManagers })
          ),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public removeVendorManagementEffect = createEffect(() =>
    this.actions.pipe(
      ofType(removeVendorProfileManagers),
      concatMap(action =>
        this.vendorsApiService.removeVendorManagement(action.vendorManagers)
      ),
      map(vendorManagement =>
        storeVendorProfileManagers({ vendorManagers: vendorManagement })
      ),
      catchError((error, originalObservable) => originalObservable)
    )
  );

  constructor(
    private actions: Actions,
    private vendorsApiService: VendorsApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
