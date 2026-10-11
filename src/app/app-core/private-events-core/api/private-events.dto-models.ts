import { LocationDTO, ProviderRequestDTO, UserEvent } from '@app-core/app-api';
import { ProfileMediaFileDTO } from '@app-core/media-core';
import { VenueType } from '@private-events-core/data-models';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';
import { VenueTokenDTO } from '@venues-core/api';

export interface CreatePrivateEvent {
  profileImage: File;
  eventMedia: File[];
  privateEvent: CreatePrivateEventDTO;
}

export interface PrivateEventLocationDTO {
  eventId?: string;
  eventVenue: PrivateEventVenueDTO;
  eventCity: string;
  eventState: string;
  eventCountry: string;
  eventLatitude: number;
  eventLongitude: number;
  eventTimeZone: string;
}

export interface PrivateEventVenueDTO {
  venueType: VenueType;
  privateAddress?: string;
  publicVenue?: VenueTokenDTO;
  bookingStatus?: string;
}

export interface CreatePrivateEventDTO {
  eventName: string;
  eventHost: UserTokenDTO;
  startTime: string;
  endTime: string;
  eventDate: string;
  eventInvitation: string;
  eventLocation: PrivateEventLocationDTO;
  eventGuests: PrivateEventGuestDTO[];
  eventFeatures: ProviderRequestDTO[];
  eventStaff: ProviderRequestDTO[];
}

export interface EventUpdateDTO {
  eventId: string;
  eventName?: string;
  startTime?: string;
  endTime?: string;
  eventDate?: string;
  eventHost?: UserTokenDTO;
  eventInvitation?: string;
}

export interface PrivateEventGuestDTO {
  guestId?: string;
  eventId?: string;
  userToken: UserTokenDTO;
  guestStatus?: string;
}

export interface PrivateEventStaffDTO {
  staffId?: string;
  eventId?: string;
  serviceProvider: ServiceProviderDTO;
  guestStatus?: string;
}

export interface PrivateEventTokenDTO extends UserEvent {
  eventId?: string;
  eventName: string;
  profileImage: string;
  eventHost?: UserTokenDTO;
  startTime: string;
  endTime: string;
  eventDate: string;
  eventInvitation: string;
  eventLocation: LocationDTO;
  eventStatus?: string;
}

export interface InvitationDTO {
  guestId: string;
  userProfileId: string;
  privateEventToken: PrivateEventTokenDTO;
  inviteMedia: ProfileMediaFileDTO[];
  invitationStatus: string;
  eventStatus: string;
}

export interface InviteResponseDTO {
  invitationId: string;
  response: string;
}

export interface UserPrivateEventDTO {
  userProfileId: string;
  eventId: string;
  eventName: string;
  profileImage: string;
  startTime: string;
  endTime: string;
  eventDate: string;
  eventLocation: PrivateEventLocationDTO;
  eventMedia: ProfileMediaFileDTO[];
  userAccess: string;
  eventStatus: string;
}
