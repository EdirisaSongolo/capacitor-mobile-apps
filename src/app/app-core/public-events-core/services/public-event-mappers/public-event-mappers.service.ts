import { Injectable } from '@angular/core';
import {
  LocationDTO,
  ProviderRequestDTO,
} from '@app-core/app-api/app-api.dto-models';
import { Profiles } from '@domain-data-models/app-domain.enums';
import { LocationMappersService } from '@domain-services/mappers/location/location-mappers.service';

import { ServiceProviderDTO } from '@profile-accounts-core/api/profile-accounts.dto-models';
import { ProfileMapperService } from '@profile-accounts-core/services/profile-mapper/profile-mapper.service';
import {
  CreateEventDateDTO,
  CreateEventLocationDTO,
  DateTokenDTO,
  LocationTokenDTO,
  PublicEventDateDTO,
  PublicEventLocationDTO,
  PublicEventTokenDTO,
  TokenLocationDate,
} from '@public-events-core/api';
import { CreatePublicEventStore } from '@public-events-core/store/create-edit-event/constants';

@Injectable({
  providedIn: 'root',
})
export class PublicEventMappersService {
  constructor(
    private profileMappers: ProfileMapperService,
    private locationMappers: LocationMappersService
  ) {}

  public createEventLocationDTOMapper(
    publicEventLocation: PublicEventLocationDTO
  ): CreateEventLocationDTO {
    const createLocation: CreateEventLocationDTO = {
      eventCity: publicEventLocation.eventCity,
      eventState: publicEventLocation.eventState,
      eventCountry: publicEventLocation.eventCountry,
      eventLatitude: publicEventLocation.eventLatitude,
      eventLongitude: publicEventLocation.eventLongitude,
      eventTimeZone: publicEventLocation.eventTimeZone,
      eventDates: [],
    };

    const locationDates: PublicEventDateDTO[] = publicEventLocation.eventDates;
    const createDates: CreateEventDateDTO[] = locationDates.flatMap(date =>
      this.createEventDateDTOMapper(date)
    );
    createLocation.eventDates = [...createDates];

    return createLocation;
  }

  public createEventDateDTOMapper(
    publicEventDateDTO: PublicEventDateDTO
  ): CreateEventDateDTO {
    const createDate: CreateEventDateDTO = {
      eventDate: publicEventDateDTO.eventDate,
      startTime: publicEventDateDTO.startTime,
      endTime: publicEventDateDTO.endTime,
      venueId: publicEventDateDTO.dateVenue.venueProfileId,
      eventTickets: publicEventDateDTO.eventTickets,
    };

    const dateFeatures: ServiceProviderDTO[] = publicEventDateDTO?.dateFeatures;
    if (dateFeatures && dateFeatures.length >= 1) {
      const createFeatures: ProviderRequestDTO[] = dateFeatures.flatMap(
        feature => this.profileMappers.providerRequestDTOMapper(feature)
      );
      createDate.dateFeatures = [...createFeatures];
    }

    const dateStaff: ServiceProviderDTO[] = publicEventDateDTO?.dateStaff;
    if (dateStaff && dateStaff.length >= 1) {
      const createStaff: ProviderRequestDTO[] = dateStaff.flatMap(feature =>
        this.profileMappers.providerRequestDTOMapper(feature)
      );
      createDate.dateStaff = [...createStaff];
    }

    return createDate;
  }

  public createEventTokenDTOMapper(
    createPublicEvent: CreatePublicEventStore
  ): PublicEventTokenDTO {
    const publicEventLocation = createPublicEvent.eventLocations[0];
    const tokenLocationDate = this.createTokenLocationDate(publicEventLocation);

    const publicEventToken: PublicEventTokenDTO = {
      profile: Profiles.publicEventProfile,
      eventName: createPublicEvent.eventName,
      eventCategory: createPublicEvent.eventCategory,
      profileImage: null,
      tokenLocationDate: tokenLocationDate,
      eventDescription: createPublicEvent.eventDescription,
    };

    return publicEventToken;
  }

  public createTokenLocationDate(
    publicEventLocation: PublicEventLocationDTO
  ): TokenLocationDate {
    if (!publicEventLocation) return null;

    const publicEventDate: PublicEventDateDTO =
      publicEventLocation.eventDates[0];
    const LocationDTO: LocationDTO =
      this.locationMappers.publicEventLocationDTO(publicEventLocation);

    return {
      locationId: publicEventLocation.locationId,
      dateId: publicEventDate.dateId,
      startTime: publicEventDate.startTime,
      endTime: publicEventDate.endTime,
      eventDate: publicEventDate.eventDate,
      eventTickets: publicEventDate.eventTickets,
      eventLocation: LocationDTO,
    };
  }

  public locationTokenDTOMapper(
    publicEventLocation: PublicEventLocationDTO
  ): LocationTokenDTO {
    if (!publicEventLocation) return null;

    const locationToken: LocationTokenDTO = {
      locationId: publicEventLocation.locationId,
      eventId: publicEventLocation.eventId,
      eventCity: publicEventLocation.eventCity,
      eventState: publicEventLocation.eventState,
      eventCountry: publicEventLocation.eventCountry,
    };

    return locationToken;
  }

  public dateTokenDTOMapper(publicEventDate: PublicEventDateDTO): DateTokenDTO {
    const dateTokenDTO: DateTokenDTO = {
      dateId: publicEventDate.dateId,
      locationId: publicEventDate.locationId,
      venueName: publicEventDate.dateVenue.venueName,
      eventDate: publicEventDate.eventDate,
      startTime: publicEventDate.startTime,
      endTime: publicEventDate.endTime,
    };

    return dateTokenDTO;
  }
}
