export enum AccountOption {
  business_details = 'BUSINESS_DETAILS',
  connected_account = 'CONNECTED_ACCOUNT',
}

export enum RevenueAccountStatus {
  healthy = 'HEALTHY',
  charges_enabled = 'CHARGES_ENABLED',
  restricted = 'RESTRICTED',
  in_active = 'IN_ACTIVE',
}

export enum BookingType {
  feature_booking = 'FEATURE_BOOKING',
  staff_booking = 'STAFF_BOOKING',
  venue_booking = 'VENUE_BOOKING',
}

export enum BookingResponse {
  confirm = 'CONFIRM',
  decline = 'DECLINE',
}

export enum InvoiceStatus {
  pending = 'PENDING',
  paid = 'PAID',
  cancelled = 'CANCELLED',
  refunded = 'REFUNDED',
}

export enum TransactionReference {
  booking_invoice = 'BOOKING_INVOICE',
  public_event_tickets = 'PUBLIC_EVENT_TICKETS',
}

export enum TransactionStatus {
  completed = 'COMPLETED',
  refunded = 'REFUNDED',
  deposited = 'DEPOSITED',
}

export enum CardBrand {
  visa = 'visa',
  mastercard = 'mastercard',
  amex = 'amex',
  discover = 'discover',
}
