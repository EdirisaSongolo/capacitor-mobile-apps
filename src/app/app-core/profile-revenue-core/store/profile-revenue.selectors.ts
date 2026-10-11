import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PROFILE_REVENUE,
  ProfileRevenueStore,
} from '@profile-revenue-core/store/constants';

export const profileRevenueFeature =
  createFeatureSelector<ProfileRevenueStore>(PROFILE_REVENUE);

export const revenueAccountSelector = createSelector(
  profileRevenueFeature,
  state => state.revenueAccount
);

export const managedBookingSelector = createSelector(
  profileRevenueFeature,
  state => state.managedBooking
);

export const managedInvoicesSelector = createSelector(
  profileRevenueFeature,
  state => state.managedInvoices
);

export const profileBookingSelector = createSelector(
  profileRevenueFeature,
  state => state.bookingRequest
);

export const customerAccountSelector = createSelector(
  profileRevenueFeature,
  state => state.customerAccount
);

export const paymentMethodsSelector = createSelector(
  profileRevenueFeature,
  state => state.paymentMethods
);

export const cardOnFileRequestSelector = createSelector(
  profileRevenueFeature,
  state => state.cardOnFileRequest
);

export const paymentRequestSelector = createSelector(
  profileRevenueFeature,
  state => state.paymentRequest
);
