import { LocationDTO, ProfileDTO, UserEventDTO } from '@app-core/app-api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';

export interface RevenueAccountDTO {
  revenueAccountId: string;
  profile: string;
  profileId: string;
  representative: RepresentativeDTO;
  identityVerification: IdentityVerificationDTO;
  businessContacts: BusinessContactsDTO;
  connectedAccount: ConnectedAccountDTO;
  accountStatus: string;
}

export interface RepresentativeDTO {
  userTokenDTO: UserTokenDTO;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface IdentityVerificationDTO {
  verificationNumber: string;
  verificationStatus?: string;
}

export interface BusinessContactsDTO {
  emailAddress: string;
  phoneNumber: string;
}

export interface ConnectedAccountDTO {
  stripeAccountId: string;
  accountName: string;
  accountNumber: string;
}

export interface DirectDepositDTO {
  revenueAccountId: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
}

export interface CardOnFileDTO {
  stripeCardId: string;
  cardBrand: string;
  cardLastFour: string;
  cardExpDate: string;
  preferred: boolean;
}

export interface CustomerAccountDTO {
  userProfileId: string;
  stripeCustomerId: string;
  cardsOnFile: CardOnFileDTO[];
}

export interface InvoiceDTO {
  amountInCents: number;
  invoiceStatus: string;
}

export interface BookingTokenDTO {
  bookingId: string;
  bookingType: string;
  userEvent: UserEventDTO;
  serviceProvider: ServiceProviderDTO;
  bookingStatus: string;
}

export interface ProfileBookingDTO {
  bookingId: string;
  bookingType: string;
  userEvent: UserEventDTO;
  serviceProvider: ServiceProviderDTO;
  invoice: InvoiceDTO;
  bookingStatus: string;
}

export interface RequestDetailsDTO {
  eventId: string;
  eventName: string;
  profileImage: string;
  requestTime: string;
  requestDate: string;
  location: LocationDTO;
}

export interface BookingResponseDTO {
  bookingId: string;
  requestResponse: string;
  amountInCents?: number;
}

export interface CardOnFileRequestDTO {
  clientSecret: string;
}

export interface PaymentIntentDTO {
  merchantProfile: ProfileDTO;
  amountInCents: number;
  currency: string;
}

export interface PaymentRequestDTO {
  amountInCents: number;
  serviceFeeInCents: number;
  grossAmountInCents: number;
  currency: string;
  merchantAccount: RevenueAccountDTO;
  customerAccount: CustomerAccountDTO;
}

export interface PaymentTransactionDTO {
  transactionReference: string;
  transactionReferenceId: string;
  amountInCents: number;
  serviceFeeInCents: number;
  grossAmountInCents: number;
  currency: string;
  merchantAccount: RevenueAccountDTO;
  customerAccount: TransactionCustomer;
  transactionMetaData: TransactionMetaData[];
}

export interface TransactionCustomer {
  userProfileId: string;
  stripeCustomerId: string;
  stripeCardId: string;
  cardLastFour: string;
}

export interface TransactionMetaData {
  name: string;
  quantity?: number;
  price: number;
  total: number;
}

export interface ManageBookingDTO {
  bookingType: string;
  providerReference: ProfileDTO;
  eventReference: EventRefenceDTO;
  requestStatus: string;
}

export interface EventRefenceDTO {
  eventType: string;
  dateReferenceId: string;
}
