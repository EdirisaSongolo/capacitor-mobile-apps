import { ProfileDTO, ResourceReferenceDTO } from '@app-core/app-api';
import { createAction, props } from '@ngrx/store';
import {
  BookingResponseDTO,
  ProfileBookingDTO,
  RevenueAccountDTO,
  DirectDepositDTO,
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

export const RETRIEVE_REVENUE_ACCOUNT =
  '[Profile Revenue] Retrieve profile revenue account';
export const retrieveRevenueAccount = createAction(
  RETRIEVE_REVENUE_ACCOUNT,
  props<{
    profileDTO: ProfileDTO;
  }>()
);

export const STORE_REVENUE_ACCOUNT =
  '[Profile Revenue] Store profile revenue account';
export const storeRevenueAccount = createAction(
  STORE_REVENUE_ACCOUNT,
  props<{ revenueAccount: RevenueAccountDTO }>()
);

export const UPDATE_ACCOUNT_REPRESENTATIVE =
  '[Profile Revenue] Update Account Representative';
export const updateAccountRepresentative = createAction(
  UPDATE_ACCOUNT_REPRESENTATIVE,
  props<{
    revenueAccountId: string;
    representativeDTO: RepresentativeDTO;
  }>()
);

export const VERIFY_REPRESENTATIVE_IDENTIFICATION =
  '[Profile Revenue] Verify Representative Identification';
export const verifyRepresentativeIdentification = createAction(
  VERIFY_REPRESENTATIVE_IDENTIFICATION,
  props<{
    revenueAccountId: string;
    identityVerificationDTO: IdentityVerificationDTO;
  }>()
);

export const UPDATE_ACCOUNT_BUSINESS_CONTACTS =
  '[Profile Revenue] Update Account Business Contacts';
export const updateAccountBusinessContacts = createAction(
  UPDATE_ACCOUNT_BUSINESS_CONTACTS,
  props<{
    revenueAccountId: string;
    businessContactsDTO: BusinessContactsDTO;
  }>()
);

export const UPDATE_CONNECTED_ACCOUNT =
  '[Profile Revenue] Update profile connected account';
export const updateConnectedAccount = createAction(
  UPDATE_CONNECTED_ACCOUNT,
  props<{
    directDeposit: DirectDepositDTO;
  }>()
);

export const RETRIEVE_MANAGED_BOOKING_REQUESTS =
  '[User Account] Retrieve managed booking requests';
export const retrieveManagedBookingRequests = createAction(
  RETRIEVE_MANAGED_BOOKING_REQUESTS
);

export const STORE_MANAGED_BOOKING_REQUESTS =
  '[User Account] Store user managed booking requests';
export const storeManagedBookingRequests = createAction(
  STORE_MANAGED_BOOKING_REQUESTS,
  props<{ managedBooking: BookingTokenDTO[] }>()
);

export const RETRIEVE_USER_MANAGED_INVOICES =
  '[User account] Retrieve user managed invoices';
export const retrieveUserManagedInvoices = createAction(
  RETRIEVE_USER_MANAGED_INVOICES
);

export const STORE_USER_MANAGED_INVOICES =
  '[User Account] Store user managed invoices';
export const storeUserManagedInvoices = createAction(
  STORE_USER_MANAGED_INVOICES,
  props<{ managedInvoices: BookingTokenDTO[] }>()
);

export const RETRIEVE_BOOKING_REQUEST_DETAILS =
  '[User Account] Retrieve profile booking request details';
export const retrieveBookingRequestDetails = createAction(
  RETRIEVE_BOOKING_REQUEST_DETAILS,
  props<{
    resourceReference: ResourceReferenceDTO;
  }>()
);

export const STORE_BOOKING_REQUEST_DETAILS =
  '[User Account] Store profile booking request details';
export const storeBookingRequestDetails = createAction(
  STORE_BOOKING_REQUEST_DETAILS,
  props<{ profileBooking: ProfileBookingDTO }>()
);

export const CONFIRM_BOOKING_REQUEST =
  '[Booking Request details] Confirm booking request';
export const confirmBookingRequest = createAction(
  CONFIRM_BOOKING_REQUEST,
  props<{
    resourceReference: ResourceReferenceDTO;
    bookingResponse: BookingResponseDTO;
  }>()
);

export const DECLINE_BOOKING_REQUEST =
  '[Booking Request details] Decline booking request';
export const declineBookingRequest = createAction(
  DECLINE_BOOKING_REQUEST,
  props<{
    resourceReference: ResourceReferenceDTO;
    bookingResponse: BookingResponseDTO;
  }>()
);

export const RETRIEVE_CUSTOMER_ACCOUNT =
  '[User Profile Dashboard] Retrieve customer account';
export const retrieveCustomerAccount = createAction(RETRIEVE_CUSTOMER_ACCOUNT);

export const STORE_CUSTOMER_ACCOUNT =
  '[Profile Revenue Core] Store customer account';
export const storeCustomerAccount = createAction(
  STORE_CUSTOMER_ACCOUNT,
  props<{ customerAccount: CustomerAccountDTO }>()
);

export const UPDATE_PREFERRED_PAYMENT_METHOD =
  '[Profile Revenue Core] Set preferred payment method';
export const updatePreferredPaymentMethod = createAction(
  UPDATE_PREFERRED_PAYMENT_METHOD,
  props<{ cardOnFile: CardOnFileDTO }>()
);

export const STORE_PAYMENT_METHODS =
  '[Profile Revenue Core] Store payment methodS';
export const storePaymentMethods = createAction(
  STORE_PAYMENT_METHODS,
  props<{ paymentMethods: CardOnFileDTO[] }>()
);

export const CREATE_PAYMENT_REQUEST =
  '[Profile Revenue Core] Create payment request';
export const createPaymentRequest = createAction(
  CREATE_PAYMENT_REQUEST,
  props<{ paymentIntent: PaymentIntentDTO }>()
);

export const STORE_PAYMENT_REQUEST =
  '[Profile Revenue Core] Store payment request';
export const storePaymentRequest = createAction(
  STORE_PAYMENT_REQUEST,
  props<{ paymentRequest: PaymentRequestDTO }>()
);

export const CREATE_CARD_ON_FILE_REQUEST =
  '[Profile Revenue Core] Create card on file request';
export const createCardOnFileRequest = createAction(
  CREATE_CARD_ON_FILE_REQUEST
);

export const STORE_CARD_ON_FILE_REQUEST =
  '[Profile Revenue Core] Store card on file request';
export const storeCardOnFileRequest = createAction(
  STORE_CARD_ON_FILE_REQUEST,
  props<{ cardOnFileRequest: CardOnFileRequestDTO }>()
);

export const SUBMIT_BOOKING_INVOICE_PAYMENT =
  '[Profile Revenue Core] Submit booking invoice payment';
export const submitBookingInvoicePayment = createAction(
  SUBMIT_BOOKING_INVOICE_PAYMENT,
  props<{
    resourceReference: ResourceReferenceDTO;
    paymentTransaction: PaymentTransactionDTO;
  }>()
);

export const CANCEL_BOOKING_REQUEST =
  '[Profile Revenue Core] Cancel booking request';
export const cancelBookingRequest = createAction(
  CANCEL_BOOKING_REQUEST,
  props<{
    resourceReference: ResourceReferenceDTO;
    manageBooking: ManageBookingDTO;
  }>()
);
