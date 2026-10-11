import { Injectable } from '@angular/core';
import { LocationDTO } from '@app-core/app-api';
import { Profiles } from '@domain-data-models/app-domain.enums';
import { LocationMappersService } from '@domain-services/mappers';
import {
  PrivateEventLocationDTO,
  PrivateEventTokenDTO,
} from '@private-events-core/api';
import { CreatePrivateEventStore } from '@private-events-core/store/create-edit-event';

@Injectable({
  providedIn: 'root',
})
export class PrivateEventMappersService {
  constructor(private locationMappers: LocationMappersService) {}

  public createEventTokenDTO(
    createPrivateEventStore: CreatePrivateEventStore
  ): PrivateEventTokenDTO {
    const privateEventLocationDTO: PrivateEventLocationDTO =
      createPrivateEventStore.eventLocation;
    const locationDTO: LocationDTO =
      this.locationMappers.privateEventLocationDTO(privateEventLocationDTO);

    const privateEventToken: PrivateEventTokenDTO = {
      profile: Profiles.privateEventProfile,
      eventName: createPrivateEventStore.eventName,
      profileImage: null,
      startTime: createPrivateEventStore.startTime,
      endTime: createPrivateEventStore.endTime,
      eventDate: createPrivateEventStore.eventDate,
      eventInvitation: createPrivateEventStore.eventInvitation,
      eventLocation: locationDTO,
    };

    return privateEventToken;
  }
}
