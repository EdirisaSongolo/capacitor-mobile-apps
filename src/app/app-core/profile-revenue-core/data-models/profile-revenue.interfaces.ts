import { ProviderDetails } from '@profile-accounts-core/data-models';
import { TransactionMetaData } from '@profile-revenue-core/api';
import { TransactionReference } from '@profile-revenue-core/data-models/profile-revenue.enums';

export interface BookingDetails {
  bookingType: string;
  eventDetails: any;
  providerDetails: ProviderDetails;
  invoiceTotal: number;
  invoiceStatus: string;
}

export interface TransactionDetails {
  transactionReference: TransactionReference;
  transactionReferenceId: string;
  receiptImage: string;
  receiptHeader: string;
  referenceDate: string;
  referenceTime: string;
  receiptName: string;
  transactionMetaData: TransactionMetaData[];
}
