export enum CreatePublicEventPanel {
  category_name = 'Public Event Category and Name',
  poster_description = 'Public Event Poster and Description',
  event_locations = 'Public Event Locations',
  event_vendors = 'Public Event Vendors',
  event_account = 'Public Event Account',
  preview_complete = 'Preview Event And Submit',
}

export enum PublicEventCategories {
  kids = 'KIDS',
  family = 'FAMILY',
  sports = 'SPORTS',
  music_concerts = 'MUSIC_CONCERTS',
  conferences = 'CONFERENCES',
  theatre = 'THEATRE',
  lectures_debates = 'LECTURES_DEBATES',
  festival = 'FESTIVAL',
  fundraiser = 'FUNDRAISER',
  parade = 'PARADE',
  other = 'OTHER',
}

export enum PublicEventCategoriesList {
  kids = 'public-events.event-categories.kids',
  family = 'public-events.event-categories.family',
  sports = 'public-events.event-categories.sports',
  music_concerts = 'public-events.event-categories.music-concerts',
  conferences = 'public-events.event-categories.conferences',
  theatre = 'public-events.event-categories.theatre',
  lectures_debates = 'public-events.event-categories.lectures-debates',
  festival = 'public-events.event-categories.festival',
  fundraiser = 'public-events.event-categories.fundraiser',
  parade = 'public-events.event-categories.parade',
  other = 'public-events.event-categories.other',
}

export enum PublicEventsDisplay {
  public_events_list = 'PUBLIC_EVENTS_LIST',
  public_events_search = 'PUBLIC_EVENTS_SEARCH',
}

export enum ProfileDisplayPanel {
  locations = 'locations',
  dates = 'dates',
  dateDetails = 'dateDetails',
  features = 'features',
  media = 'media',
  merch = 'merch',
}

export enum DashboardDisplayPanel {
  details = 'details',
  media = 'media',
  locations = 'locations',
  staff = 'staff',
  shop = 'shop',
  account = 'account',
  cancel = 'cancel',
}

export enum LocationsDisplay {
  create_edit_location = 'CREATE_EVENT_LOCATION',
  public_event_location = 'PUBLIC_EVENT_LOCATION',
  create_edit_date = 'CREATE_EDIT_DATE',
}

export enum PublicEventAction {
  create_event = 'CREATE_EVENT',
  edit_event = 'EDIT_EVENT',
}

export enum LocationAction {
  create_location = 'CREATE_LOCATION',
  edit_location = 'EDIT_LOCATION',
}

export enum LocationDateAction {
  create_date = 'CREATE_DATE',
  edit_date = 'EDIT_DATE',
}

export enum FeaturesDisplay {
  features_list = 'FEATURES_LIST',
  service_providers = 'SERVICE_PROVIDERS',
}

export enum EventStaffDisplay {
  event_locations = 'EVENT_LOCATIONS',
  create_edit_staff = 'CREATE_EDIT_STAFF',
}

export enum DatesDisplay {
  event_dates = 'EVENT_DATES',
  location_dates = 'LOCATION_DATES',
}

export enum EventComponents {
  event_location = 'EVENT_LOCATION',
  event_date = 'EVENT_DATE',
  event_feature = 'EVENT_FEATURE',
  event_staff = 'EVENT_STAFF',
}
