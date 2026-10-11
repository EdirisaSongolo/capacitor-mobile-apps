import {
  ProfileBookingDTO,
  RevenueAccountDTO,
  BookingTokenDTO,
  PaymentRequestDTO,
  CardOnFileRequestDTO,
  CustomerAccountDTO,
  CardOnFileDTO,
} from '@profile-revenue-core/api/profile-revenue.dto-models';

export const PROFILE_REVENUE = 'profile-revenue';

export interface ProfileRevenueStore {
  customerAccount: CustomerAccountDTO;
  paymentMethods: CardOnFileDTO[];
  revenueAccount: RevenueAccountDTO;
  managedBooking: BookingTokenDTO[];
  managedInvoices: BookingTokenDTO[];
  bookingRequest: ProfileBookingDTO;
  cardOnFileRequest: CardOnFileRequestDTO;
  paymentRequest: PaymentRequestDTO;
}
