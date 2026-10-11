import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiService,
  ProfileDTO,
  ResourceReferenceDTO,
  SuccessResponseDTO,
} from '@app-core/app-api';

import {
  BookingResponseDTO,
  DirectDepositDTO,
  ProfileBookingDTO,
  RevenueAccountDTO,
  BookingTokenDTO,
  PaymentIntentDTO,
  PaymentRequestDTO,
  CardOnFileRequestDTO,
  PaymentTransactionDTO,
  ManageBookingDTO,
  RepresentativeDTO,
  IdentityVerificationDTO,
  BusinessContactsDTO,
  CustomerAccountDTO,
  CardOnFileDTO,
} from '@profile-revenue-core/api/profile-revenue.dto-models';
import { ProfileRevenueRestConstants } from '@profile-revenue-core/api/profile-revenue.rest-constants';
import { HttpHeaders } from '@angular/common/http';
import { ApiRestConstants } from '@app-core/app-api/app-api.rest-constants';

@Injectable({
  providedIn: 'root',
})
export class ProfileRevenueApiService {
  constructor(private apiService: ApiService) {}

  public retrieveRevenueAccount(
    profile: ProfileDTO
  ): Observable<RevenueAccountDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.RETRIEVE_REVENUE_ACCOUNT}`;
    return this.apiService.post<RevenueAccountDTO>(requestMapping, profile);
  }

  public updateAccountRepresentative(
    revenueAccountId: string,
    representativeDTO: RepresentativeDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.UPDATE_ACCOUNT_REPRESENTATIVE}`;

    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set(
      ApiRestConstants.REVENUE_ACCOUNT_ID,
      revenueAccountId
    );

    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      representativeDTO,
      httpHeaders
    );
  }

  public verifyRepresentativeIdentification(
    revenueAccountId: string,
    identityVerificationDTO: IdentityVerificationDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.VERIFY_REPRESENTATIVE_IDENTIFICATION}`;
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set(
      ApiRestConstants.REVENUE_ACCOUNT_ID,
      revenueAccountId
    );

    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      identityVerificationDTO,
      httpHeaders
    );
  }

  public updateAccountBusinessContacts(
    revenueAccountId: string,
    businessContactsDTO: BusinessContactsDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.UPDATE_ACCOUNT_BUSINESS_CONTACTS}`;
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set(
      ApiRestConstants.REVENUE_ACCOUNT_ID,
      revenueAccountId
    );

    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      businessContactsDTO,
      httpHeaders
    );
  }

  public updateAccountDirectDeposit(
    directDeposit: DirectDepositDTO
  ): Observable<any> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.UPDATE_ACCOUNT_DIRECT_DEPOSIT}`;
    return this.apiService.post<any>(requestMapping, directDeposit);
  }

  public createCardOnFileRequest(): Observable<CardOnFileRequestDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.CREATE_CARD_ON_FILE_REQUEST}`;
    return this.apiService.get<CardOnFileRequestDTO>(requestMapping);
  }

  public retrieveManagedBookingRequests(): Observable<BookingTokenDTO[]> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.RETRIEVE_MANAGED_BOOKING_REQUESTS}`;
    return this.apiService.get<BookingTokenDTO[]>(requestMapping);
  }

  public retrieveUserManagedInvoices(): Observable<BookingTokenDTO[]> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.RETRIEVE_USER_MANAGED_INVOICES}`;
    return this.apiService.get<BookingTokenDTO[]>(requestMapping);
  }

  public retrieveBookingRequestDetails(
    resourceReference: ResourceReferenceDTO
  ): Observable<ProfileBookingDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.RETRIEVE_BOOKING_REQUEST_DETAILS}`;
    return this.apiService.post<ProfileBookingDTO>(
      requestMapping,
      resourceReference
    );
  }

  public confirmProfileBookingRequest(
    bookingResponse: BookingResponseDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.CONFIRM_BOOKING_REQUEST}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      bookingResponse
    );
  }

  public declineProfileBookingRequest(
    bookingResponse: BookingResponseDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.DECLINE_BOOKING_REQUEST}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      bookingResponse
    );
  }

  public retrieveCustomerAccount(): Observable<CustomerAccountDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.RETRIEVE_CUSTOMER_ACCOUNT}`;
    return this.apiService.get<CustomerAccountDTO>(requestMapping);
  }

  public updatePreferredPaymentMethod(
    cardOnFile: CardOnFileDTO
  ): Observable<CardOnFileDTO[]> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.UPDATE_PREFERRED_PAYMENT_METHOD}`;
    return this.apiService.post<CardOnFileDTO[]>(requestMapping, cardOnFile);
  }

  public createPaymentRequest(
    paymentIntent: PaymentIntentDTO
  ): Observable<PaymentRequestDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.CREATE_PAYMENT_REQUEST}`;
    return this.apiService.post<PaymentRequestDTO>(
      requestMapping,
      paymentIntent
    );
  }

  public submitBookingInvoicePayment(
    paymentTransaction: PaymentTransactionDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.SUBMIT_BOOKING_INVOICE_PAYMENT}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      paymentTransaction
    );
  }

  public cancelProfileBookingRequest(
    manageBooking: ManageBookingDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${ProfileRevenueRestConstants.PROFILE_REVENUE}/${ProfileRevenueRestConstants.CANCEL_BOOKING_REQUEST}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      manageBooking
    );
  }
}
