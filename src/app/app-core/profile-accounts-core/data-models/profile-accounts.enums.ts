export enum BusinessProfileStatus {
  enabled = 'ENABLED',
  disabled = 'DISABLED',
}

export enum ServiceProviderCategories {
  musician_band = 'MUSICIAN_BAND',
  dancer = 'DANCER',
  dj = 'DJ',
  performer = 'PERFORMER',
  promoter_mc = 'PROMOTER_MC',
  catering = 'CATERING',
  rentals = 'RENTALS',
  photographer = 'PHOTOGRAPHER',
  transportation = 'TRANSPORTATION',
  aesthetician = 'AESTHETICIAN',
  security = 'SECURITY',
}

export enum UserProfileCategories {
  musician = 'MUSICIAN',
  dancer = 'DANCER',
  dj = 'DJ',
  photographer = 'PHOTOGRAPHER',
  aesthetician = 'AESTHETICIAN',
  promoter_mc = 'PROMOTER_MC',
  performer = 'PERFORMER',
  other = 'OTHER',
}

export enum VendorCategories {
  band = 'BAND',
  catering = 'CATERING',
  rentals = 'RENTALS',
  transportation = 'TRANSPORTATION',
  security = 'SECURITY',
  other = 'OTHER',
}

export enum VenueCategories {
  sports_arena = 'SPORTS_ARENA',
  hotel = 'HOTEL',
  bar_nightClub = 'BAR_NIGHTCLUB',
  restaurant = 'RESTAURANT',
  comedy_club = 'COMEDY_CLUB',
  other = 'OTHER',
}

export enum RateUnitsOptions {
  hour = 'HOUR',
  day = 'DAY',
  table = 'TABLE',
  person = 'PERSON',
  not_selected = 'NOT_SELECTED',
}

export enum ServiceDialogAction {
  createService = 'CREATE_SERVICE',
  editService = 'EDIT_SERVICE',
}

export enum ServiceOption {
  included = 'INCLUDED',
  additional = 'ADDITIONAL',
}

export enum ServiceProviderDomains {
  feature_profiles = 'FEATURE_PROFILES',
  staff_profiles = 'STAFF_PROFILES',
}

export enum ServiceProvidersDisplay {
  service_providers = 'SERVICE_PROVIDERS',
  search_results = 'SEARCH_RESULTS',
}

export enum BookingAction {
  create = 'CREATE',
  update = 'UPDATE',
  cancel = 'CANCEL',
}
