import { Injectable } from '@angular/core';
import { UserEventDTO } from '@app-core/app-api';
import { EventTypes } from '@domain-data-models/app-domain.enums';
import { PrivateEventTokenDTO } from '@private-events-core/api';
import { EventRefenceDTO } from '@profile-revenue-core/api';
import {
  PublicEventTokenDTO,
  TokenLocationDate,
} from '@public-events-core/api';

@Injectable({
  providedIn: 'root',
})
export class UserEventMapperService {
  constructor() {}

  public userEventToEventReferenceDTO(
    userEvent: UserEventDTO
  ): EventRefenceDTO {
    let eventReference: EventRefenceDTO;

    if (userEvent.eventType === EventTypes.publicEvent) {
      const publicEvent = userEvent as PublicEventTokenDTO;
      const tokenLocationDate: TokenLocationDate =
        publicEvent.tokenLocationDate;

      eventReference = {
        eventType: userEvent.eventType,
        dateReferenceId: tokenLocationDate.dateId,
      };
    } else if (userEvent.eventType === EventTypes.privateEvent) {
      const privateEvent = userEvent as PrivateEventTokenDTO;

      eventReference = {
        eventType: userEvent.eventType,
        dateReferenceId: privateEvent.eventId,
      };
    }

    return eventReference;
  }
}
