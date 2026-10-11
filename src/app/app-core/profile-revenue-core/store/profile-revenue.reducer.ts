import { createReducer, on } from '@ngrx/store';
import { ProfileRevenueStore } from '@profile-revenue-core/store/constants';
import {
  storeRevenueAccount,
  storeManagedBookingRequests,
  storeUserManagedInvoices,
  storeBookingRequestDetails,
  storePaymentRequest,
  createCardOnFileRequest,
  storeCardOnFileRequest,
  storeCustomerAccount,
  storePaymentMethods,
  retrieveRevenueAccount,
} from '@profile-revenue-core/store/profile-revenue.actions';

export const profileRevenueState: ProfileRevenueStore = {
  customerAccount: null,
  paymentMethods: [],
  revenueAccount: null,
  managedBooking: [],
  managedInvoices: [],
  bookingRequest: null,
  cardOnFileRequest: null,
  paymentRequest: null,
};

export const profileRevenueReducer = createReducer(
  profileRevenueState,
  on(retrieveRevenueAccount, (state): ProfileRevenueStore => ({
    ...state,
    revenueAccount: null,
  })),
  on(storeRevenueAccount, (state, { revenueAccount }) => ({
    ...state,
    revenueAccount: revenueAccount,
  })),
  on(storePaymentMethods, (state, { paymentMethods: cardOnFile }) => ({
    ...state,
    paymentMethods: cardOnFile,
  })),
  on(
    storeManagedBookingRequests,
    (state, { managedBooking: profileBookingRequests }) => ({
      ...state,
      managedBooking: profileBookingRequests,
    })
  ),
  on(storeBookingRequestDetails, (state, { profileBooking }) => ({
    ...state,
    bookingRequest: profileBooking,
  })),
  on(storeUserManagedInvoices, (state, { managedInvoices }) => ({
    ...state,
    managedInvoices: managedInvoices,
  })),
  on(storeCustomerAccount, (state, { customerAccount }) => ({
    ...state,
    customerAccount: customerAccount,
  })),
  on(createCardOnFileRequest, (state): ProfileRevenueStore => ({
    ...state,
    cardOnFileRequest: null,
  })),
  on(storeCardOnFileRequest, (state, { cardOnFileRequest }) => ({
    ...state,
    cardOnFileRequest: cardOnFileRequest,
  })),
  on(storePaymentRequest, (state, { paymentRequest }) => ({
    ...state,
    paymentRequest: paymentRequest,
  }))
);
