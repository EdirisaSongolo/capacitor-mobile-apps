import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { VenueTokenDTO } from '@venues-core/api';
import { EventComponents } from '@public-events-core/data-models/public-events.enums';
import {
  ProviderRequestDTO,
  ProfileDTO,
  UserEvent,
  LocationDTO,
} from '@app-core/app-api';
import { VendorTokenDTO } from '@vendors-core/api';

export interface CreatePublicEvent {
  eventPoster: File;
  eventMedia: File[];
  publicEvent: CreatePublicEventDTO;
}

export interface CreatePublicEventDTO {
  eventName: string;
  eventCategory: string;
  eventDescription: string;
  eventPrincipal: ProfileDTO;
  eventLocations: CreateEventLocationDTO[];
}

export interface CreateEventLocationDTO {
  eventId?: string;
  eventCity: string;
  eventState: string;
  eventCountry: string;
  eventLatitude: number;
  eventLongitude: number;
  eventTimeZone: string;
  eventDates: CreateEventDateDTO[];
}

export interface CreateEventDateDTO {
  locationId?: string;
  venueId: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventTickets: Record<string, number>;
  dateFeatures?: ProviderRequestDTO[];
  dateStaff?: ProviderRequestDTO[];
}

export interface DateDetailsDTO {
  dateId: string;
  locationId: string;
  startTime: string;
  endTime: string;
  eventDate: string;
  eventTickets: Record<string, number>;
}

export interface EventComponentDTO {
  component: EventComponents;
  componentId: string;
}

export interface EventProviderDTO {
  component: EventComponents;
  componentId: string;
  profileDTO: ProfileDTO;
}

export interface LocationTokenDTO {
  locationId: string;
  eventId: string;
  profileImage?: string;
  eventCity: string;
  eventState: string;
  eventCountry: string;
}

export interface PublicEventLocationDTO {
  locationId?: string;
  eventId?: string;
  eventCity: string;
  eventState: string;
  eventCountry: string;
  eventLatitude: number;
  eventLongitude: number;
  eventTimeZone: string;
  eventDates: PublicEventDateDTO[];
}

export interface DateTokenDTO {
  dateId: string;
  locationId: string;
  profileImage?: string;
  venueName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
}

export interface PublicEventDateDTO {
  dateId: string;
  locationId: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueBookingStatus?: string;
  dateStatus?: string;
  dateVenue: VenueTokenDTO;
  eventTickets: Record<string, number>;
  dateFeatures?: ServiceProviderDTO[];
  dateStaff?: ServiceProviderDTO[];
}

export interface EventDateProfileDTO {
  eventDetails: EventDetailsDTO;
  publicEventDate: PublicEventDateDTO;
  publicEventPrincipal: PublicEventPrincipalDTO;
  userEventStatus: string;
}

export interface PublicEventFeatureDTO {
  eventFeatureId?: string;
  eventDateId?: string;
  profile: string;
  profileId: string;
  profileImage?: string;
  featureStatus?: string;
}

export interface PublicEventPrincipalDTO {
  principalId?: string;
  eventId?: string;
  principalProfile: VendorTokenDTO;
  managerStatus?: string;
}

export interface EventDetailsDTO {
  eventId: string;
  eventCategory: string;
  eventName: string;
  profileImage?: string;
  eventDescription: string;
}

export interface PublicEventTokenDTO extends UserEvent {
  eventId?: string;
  eventName: string;
  eventCategory: string;
  profileImage: string;
  tokenLocationDate: TokenLocationDate;
  eventDescription: string;
  eventStatus?: string;
}

export interface TokenLocationDate {
  locationId: string;
  dateId: string;
  startTime: string;
  endTime: string;
  eventDate: string;
  eventTickets: Record<string, number>;
  eventLocation: LocationDTO;
}
export interface UserPublicEventDTO {
  userEventId: string;
  userProfileId: string;
  eventId: string;
  eventDateId: string;
  userEventStatus: string;
  userTickets: UserTicketsDTO[];
  eventDetails: EventDetailsDTO;
  publicEventDate: PublicEventDateDTO;
  publicEventPrincipal: PublicEventPrincipalDTO;
}

export interface UserTicketsDTO {
  userTicketId: string;
  userEventId: string;
  ticketQRCode: string;
  ticketName: string;
  ticketPrice: number;
  scanStatus: string;
  ticketStatus: string;
}
