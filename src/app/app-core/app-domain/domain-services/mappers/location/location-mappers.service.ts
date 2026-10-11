import { Injectable } from '@angular/core';
import { LocationDTO } from '@app-core/app-api/app-api.dto-models';
import { LocationDetails } from '@domain-data-models/app-domain.interfaces';
import tzLookup from '@photostructure/tz-lookup';
import { PrivateEventLocationDTO } from '@private-events-core/api';
import { PublicEventLocationDTO } from '@public-events-core/api';

@Injectable({
  providedIn: 'root',
})
export class LocationMappersService {
  constructor() {}

  public profileLocationDTO(locationDetails: LocationDetails): LocationDTO {
    if (!locationDetails) return null;

    if (!locationDetails.street_number || !locationDetails.street) return null;

    const locationDTO: LocationDTO = {
      address: `${locationDetails.street_number} ${locationDetails.street}`,
      postalCode: locationDetails.postal_code as string,
      city: locationDetails.city,
      state: locationDetails.state,
      country: locationDetails.country,
      latitude: locationDetails.latitude as number,
      longitude: locationDetails.longitude as number,
    };

    return locationDTO;
  }

  public createLocationDTO(locationDetails: LocationDetails): LocationDTO {
    if (!locationDetails) return null;

    const locationDTO: LocationDTO = {
      city: locationDetails.city,
      state: locationDetails.state,
      country: locationDetails.country,
      latitude: locationDetails.latitude as number,
      longitude: locationDetails.longitude as number,
      timeZone: tzLookup(locationDetails.latitude, locationDetails.longitude),
    };

    return locationDTO;
  }

  public publicEventLocationDTO(
    publicEventLocationDTO: PublicEventLocationDTO
  ): LocationDTO {
    if (!publicEventLocationDTO) return null;

    const locationDTO: LocationDTO = {
      city: publicEventLocationDTO.eventCity,
      state: publicEventLocationDTO.eventState,
      country: publicEventLocationDTO.eventCountry,
      latitude: publicEventLocationDTO.eventLatitude,
      longitude: publicEventLocationDTO.eventLongitude,
    };

    return locationDTO;
  }

  public createPrivateEventAddress(
    locationDetails: LocationDetails
  ): LocationDTO {
    if (!locationDetails) return null;

    if (!locationDetails.street_number || !locationDetails.street) return null;

    const locationDTO: LocationDTO = {
      address: `${locationDetails.street_number} ${locationDetails.street}`,
      postalCode: locationDetails.postal_code as string,
      city: locationDetails.city,
      state: locationDetails.state,
      country: locationDetails.country,
      latitude: locationDetails.latitude as number,
      longitude: locationDetails.longitude as number,
      timeZone: tzLookup(locationDetails.latitude, locationDetails.longitude),
    };

    return locationDTO;
  }

  public privateEventLocationDTO(
    privateEventLocation: PrivateEventLocationDTO
  ): LocationDTO {
    if (!privateEventLocation) return null;

    const locationDTO: LocationDTO = {
      city: privateEventLocation.eventCity,
      state: privateEventLocation.eventState,
      country: privateEventLocation.eventCountry,
      latitude: privateEventLocation.eventLatitude,
      longitude: privateEventLocation.eventLongitude,
    };

    return locationDTO;
  }

  public compareLocationDTOs(
    location: LocationDTO,
    comparison: LocationDTO
  ): boolean {
    if (location === null || comparison === null) return false;

    let isEqual: boolean = true;
    if (location.address !== comparison.address) isEqual = false;
    if (location.city !== comparison.city) isEqual = false;
    if (location.state !== comparison.state) isEqual = false;
    if (location.country !== comparison.country) isEqual = false;

    return isEqual;
  }

  public mapLocationDTOAddress(locationDTO: LocationDTO): string {
    return `${locationDTO.address}, ${locationDTO?.city}, ${locationDTO.state}`;
  }
}
