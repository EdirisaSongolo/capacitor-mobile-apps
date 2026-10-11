export enum Device {
  mobile = 'Mobile',
  tablet = 'Tablet',
  desktop = 'Desktop',
}

export enum LocationStatus {
  locationSet = 'LOCATION_SET',
  permissionDenied = 'PERMISSION_DENIED',
  locationUnavailable = 'LOCATION_UNAVAILABLE',
}

export enum NavOption {
  dashboard = 'DASHBOARD',
  create_event = 'CREATE EVENT',
  venues = 'VENUES',
  service_providers = 'SERVICE_PROVIDERS',
  search = 'SEARCH',
  user_account = 'USER_ACCOUNT',
  messaging = 'MESSAGING',
  notifications = 'NOTIFICATIONS',
}

export enum AppResponseType {
  success = 'Success',
  warning = 'Warning',
  error = 'Error',
}

export enum EventTypes {
  publicEvent = 'PUBLIC_EVENT',
  privateEvent = 'PRIVATE_EVENT',
}

export enum Profiles {
  userProfile = 'USER_PROFILE',
  venueProfile = 'VENUE_PROFILE',
  vendorProfile = 'VENDOR_PROFILE',
  publicEventProfile = 'PUBLIC_EVENT_PROFILE',
  privateEventProfile = 'PRIVATE_EVENT_PROFILE',
}

export enum ProfileStatus {
  active = 'Active',
  closed = 'Closed',
  cancelled = 'Cancelled',
}

export enum RequestStatus {
  pending = 'PENDING',
  confirmed = 'CONFIRMED',
  declined = 'DECLINED',
  closed = 'CLOSED',
  cancelled = 'CANCELLED',
  removed = 'REMOVED',
}

export enum RequestStatusStrings {
  pending = 'status.pending',
  confirmed = 'status.confirmed',
  declined = 'status.declined',
  closed = 'status.closed',
  cancelled = 'status.cancelled',
  removed = 'status.removed',
}

export enum ComponentAction {
  dashboard = 'DASHBOARD',
  profile = 'PROFILE',
  event_management = 'EVENT_MANAGEMENT',
}

export enum ManagementDisplay {
  managementList = 'MANAGEMENT_LIST',
  socialsList = 'SOCIALS_LIST',
}

export enum DialogAction {
  confirmed = 'CONFIRMED',
  cancelled = 'CANCELLED',
}

export enum ReferencedResources {
  serviceProvider = 'SERVICE_PROVIDER',
  service = 'SERVICE',
  profileBooking = 'PROFILE_BOOKING',
  bookingInvoice = 'BOOKING_INVOICE',
  searchRecord = 'SEARCH_RECORD',
}

export enum UserEventAccess {
  none = 'NONE',
  saved = 'SAVED',
  ticketed = 'TICKETED',
  invited = 'INVITED',
  confirmed = 'CONFIRMED',
  declined = 'DECLINED',
  archived = 'ARCHIVED',
  revoked = 'REVOKED',
}

export enum AppTheme {
  light = 'light',
  dark = 'dark',
}

export enum ThemePreference {
  light = 'LIGHT',
  dark = 'DARK',
  system = 'SYSTEM',
}
