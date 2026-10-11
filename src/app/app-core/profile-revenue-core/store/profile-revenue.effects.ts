import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, concatMap, map, mergeMap } from 'rxjs';

import { ApiResponseService, SuccessResponseDTO } from '@app-core/app-api';
import {
  retrieveBookingRequestDetails,
  retrieveManagedBookingRequests,
  retrieveRevenueAccount,
  storeBookingRequestDetails,
  storeManagedBookingRequests,
  updateConnectedAccount,
  storeRevenueAccount,
  confirmBookingRequest,
  declineBookingRequest,
  retrieveUserManagedInvoices,
  storeUserManagedInvoices,
  createPaymentRequest,
  storePaymentRequest,
  createCardOnFileRequest,
  storeCardOnFileRequest,
  submitBookingInvoicePayment,
  cancelBookingRequest,
  updateAccountRepresentative,
  verifyRepresentativeIdentification,
  updateAccountBusinessContacts,
  retrieveCustomerAccount,
  storeCustomerAccount,
  updatePreferredPaymentMethod,
  storePaymentMethods,
} from '@profile-revenue-core/store/profile-revenue.actions';
import { ProfileRevenueApiService } from '@profile-revenue-core/api/service/profile-revenue-api.service';

@Injectable()
export class ProfileRevenueEffects {
  public retrieveRevenueAccountEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveRevenueAccount),
      concatMap(action =>
        this.profileRevenueApiService
          .retrieveRevenueAccount(action.profileDTO)
          .pipe(
            map(revenueAccount =>
              storeRevenueAccount({ revenueAccount: revenueAccount })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public updateAccountRepresentativeEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateAccountRepresentative),
      concatMap(action =>
        this.profileRevenueApiService
          .updateAccountRepresentative(
            action.revenueAccountId,
            action.representativeDTO
          )
          .pipe(
            map((response: SuccessResponseDTO) =>
              this.apiResponseService.createApiCallSuccessResponse(response)
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public verifyRepresentativeIdentificationEffect = createEffect(() =>
    this.actions.pipe(
      ofType(verifyRepresentativeIdentification),
      concatMap(action =>
        this.profileRevenueApiService
          .verifyRepresentativeIdentification(
            action.revenueAccountId,
            action.identityVerificationDTO
          )
          .pipe(
            map((response: SuccessResponseDTO) =>
              this.apiResponseService.createApiCallSuccessResponse(response)
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public updateAccountBusinessContactsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateAccountBusinessContacts),
      concatMap(action =>
        this.profileRevenueApiService
          .updateAccountBusinessContacts(
            action.revenueAccountId,
            action.businessContactsDTO
          )
          .pipe(
            map((response: SuccessResponseDTO) =>
              this.apiResponseService.createApiCallSuccessResponse(response)
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public updateConnectedAccountEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updateConnectedAccount),
      concatMap(action =>
        this.profileRevenueApiService
          .updateAccountDirectDeposit(action.directDeposit)
          .pipe(
            map(businessProfile =>
              storeRevenueAccount({
                revenueAccount: businessProfile,
              })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveManagedBookingRequestsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveManagedBookingRequests),
      concatMap(action =>
        this.profileRevenueApiService.retrieveManagedBookingRequests().pipe(
          map(profileBookingRequests =>
            storeManagedBookingRequests({
              managedBooking: profileBookingRequests,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public retrieveBookingRequestDetailsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveBookingRequestDetails),
      concatMap(action =>
        this.profileRevenueApiService
          .retrieveBookingRequestDetails(action.resourceReference)
          .pipe(
            map(response =>
              storeBookingRequestDetails({ profileBooking: response })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public confirmBookingRequestEffect = createEffect(() =>
    this.actions.pipe(
      ofType(confirmBookingRequest),
      concatMap(action =>
        this.profileRevenueApiService
          .confirmProfileBookingRequest(action.bookingResponse)
          .pipe(
            mergeMap((response: SuccessResponseDTO) => [
              retrieveBookingRequestDetails({
                resourceReference: action.resourceReference,
              }),
              this.apiResponseService.createApiCallSuccessResponse(response),
            ]),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public declineBookingRequestEffect = createEffect(() =>
    this.actions.pipe(
      ofType(declineBookingRequest),
      concatMap(action =>
        this.profileRevenueApiService
          .declineProfileBookingRequest(action.bookingResponse)
          .pipe(
            mergeMap((response: SuccessResponseDTO) => [
              retrieveBookingRequestDetails({
                resourceReference: action.resourceReference,
              }),
              this.apiResponseService.createApiCallSuccessResponse(response),
            ]),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public retrieveManagedInvoicesEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveUserManagedInvoices),
      concatMap(() =>
        this.profileRevenueApiService.retrieveUserManagedInvoices().pipe(
          map(managedInvoices => storeUserManagedInvoices({ managedInvoices })),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public retriveCustomerAccountEffect = createEffect(() =>
    this.actions.pipe(
      ofType(retrieveCustomerAccount),
      concatMap(() =>
        this.profileRevenueApiService.retrieveCustomerAccount().pipe(
          map(customerAccount =>
            storeCustomerAccount({ customerAccount: customerAccount })
          ),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public updatePreferredPaymentEffect = createEffect(() =>
    this.actions.pipe(
      ofType(updatePreferredPaymentMethod),
      concatMap(action =>
        this.profileRevenueApiService
          .updatePreferredPaymentMethod(action.cardOnFile)
          .pipe(
            map(cardOnFile =>
              storePaymentMethods({ paymentMethods: cardOnFile })
            ),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public createCardOnFileRequestEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createCardOnFileRequest),
      concatMap(() =>
        this.profileRevenueApiService.createCardOnFileRequest().pipe(
          map(cardOnFileRequest =>
            storeCardOnFileRequest({ cardOnFileRequest })
          ),
          catchError((error: HttpErrorResponse) =>
            this.apiResponseService.createApiCallErrorResponse(error)
          )
        )
      )
    )
  );

  public createPaymentRequestEffect = createEffect(() =>
    this.actions.pipe(
      ofType(createPaymentRequest),
      concatMap(action =>
        this.profileRevenueApiService
          .createPaymentRequest(action.paymentIntent)
          .pipe(
            map(paymentRequest => storePaymentRequest({ paymentRequest })),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public submitInvoicePaymentEffect = createEffect(() =>
    this.actions.pipe(
      ofType(submitBookingInvoicePayment),
      concatMap(action =>
        this.profileRevenueApiService
          .submitBookingInvoicePayment(action.paymentTransaction)
          .pipe(
            mergeMap((response: SuccessResponseDTO) => [
              retrieveBookingRequestDetails({
                resourceReference: action.resourceReference,
              }),
              this.apiResponseService.createApiCallSuccessResponse(response),
            ]),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  public cancelBookingRequestEffect = createEffect(() =>
    this.actions.pipe(
      ofType(cancelBookingRequest),
      concatMap(action =>
        this.profileRevenueApiService
          .cancelProfileBookingRequest(action.manageBooking)
          .pipe(
            mergeMap((response: SuccessResponseDTO) => [
              retrieveBookingRequestDetails({
                resourceReference: action.resourceReference,
              }),
              this.apiResponseService.createApiCallSuccessResponse(response),
            ]),
            catchError((error: HttpErrorResponse) =>
              this.apiResponseService.createApiCallErrorResponse(error)
            )
          )
      )
    )
  );

  constructor(
    private actions: Actions,
    private profileRevenueApiService: ProfileRevenueApiService,
    private apiResponseService: ApiResponseService
  ) {}
}
