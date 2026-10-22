import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, UserEventDTO } from '@app-core/app-api';
import {
  CreateEventDateDTO,
  CreateEventLocationDTO,
  CreatePublicEvent,
  DateTokenDTO,
  EventComponentDTO,
  EventProviderDTO,
  LocationTokenDTO,
  PublicEventDateDTO,
  EventDetailsDTO,
  PublicEventLocationDTO,
  PublicEventPrincipalDTO,
  PublicEventsRestConstants,
  EventDateProfileDTO,
  UserPublicEventDTO,
  DateDetailsDTO,
  TicketScanDTO,
} from '@public-events-core/api';
import { PublicEventTokenDTO } from '@public-events-core/api';
import {
  ProviderRequestDTO,
  LocationCategoriesDTO,
  ProfileDTO,
  SearchDTO,
  SuccessResponseDTO,
} from '@app-core/app-api/app-api.dto-models';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { PaymentTransactionDTO } from '@profile-revenue-core/api';

@Injectable({
  providedIn: 'root',
})
export class PublicEventsApiService {
  constructor(private apiService: ApiService) {}
  public createPublicEvent(
    createPublicEvent: CreatePublicEvent
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CREATE_PUBLIC_EVENT}`;

    const publicEventFormData: FormData = new FormData();

    publicEventFormData.append('profileImage', createPublicEvent.eventPoster);
    createPublicEvent.eventMedia.forEach(file =>
      publicEventFormData.append('profileMedia', file, file.name)
    );
    publicEventFormData.append(
      'publicEvent',
      JSON.stringify(createPublicEvent.publicEvent)
    );

    return this.apiService.multiPartPost<SuccessResponseDTO>(
      requestMapping,
      publicEventFormData
    );
  }

  public updatePublicEventDetails(
    eventDetails: EventDetailsDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.UPDATE_PUBLIC_EVENT_DETAILS}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      eventDetails
    );
  }

  public cancelPublicEvent(
    profileDTO: ProfileDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CANCEL_PUBLIC_EVENT}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, profileDTO);
  }

  public createPublicEventLocation(
    createEventLocation: CreateEventLocationDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CREATE_PUBLIC_EVENT_LOCATION}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      createEventLocation
    );
  }

  public retrievePublicEventDate(
    eventComponent: EventComponentDTO
  ): Observable<PublicEventDateDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_PUBLIC_EVENT_DATE}`;
    return this.apiService.post<PublicEventDateDTO>(
      requestMapping,
      eventComponent
    );
  }

  public createPublicEventDate(
    createEventDate: CreateEventDateDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CREATE_PUBLIC_EVENT_DATE}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      createEventDate
    );
  }

  public createPublicEventFeature(
    providerRequest: ProviderRequestDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CREATE_PUBLIC_EVENT_FEATURE}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequest
    );
  }

  public cancelPublicEventFeature(
    providerRequest: ProviderRequestDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CANCEL_PUBLIC_EVENT_FEATURE}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequest
    );
  }

  public updateEventDateDetails(
    dateDetails: DateDetailsDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.UPDATE_EVENT_DATE_DETAILS}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      dateDetails
    );
  }

  public cancelPublicEventLocation(
    eventComponent: EventComponentDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CANCEL_PUBLIC_EVENT_LOCATION}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      eventComponent
    );
  }

  public cancelPublicEventDate(
    eventComponent: EventComponentDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CANCEL_PUBLIC_EVENT_DATE}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      eventComponent
    );
  }

  public retrieveStaffLocationDates(
    eventProvider: EventProviderDTO
  ): Observable<DateTokenDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_STAFF_LOCATION_DATES}`;
    return this.apiService.post<DateTokenDTO[]>(requestMapping, eventProvider);
  }

  public createPublicEventStaff(
    providerRequests: ProviderRequestDTO[]
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CERATE_PUBLIC_EVENT_STAFF}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequests
    );
  }

  public updatePublicEventStaff(
    providerRequests: ProviderRequestDTO[]
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.UPDATE_PUBLIC_EVENT_STAFF}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequests
    );
  }

  public retrieveEventPrincipalProfile(
    profile: ProfileDTO
  ): Observable<PublicEventPrincipalDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_EVENT_PRINCIPAL_PROFILE}`;
    return this.apiService.post<PublicEventPrincipalDTO>(
      requestMapping,
      profile
    );
  }

  public retrievePublicEvents(
    location: LocationCategoriesDTO
  ): Observable<PublicEventTokenDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_LOCATION_PUBLIC_EVENTS_TOKENS}`;
    return this.apiService.post<PublicEventTokenDTO[]>(
      requestMapping,
      location
    );
  }

  public retrievePublicEventSearchResults(
    searchDTO: SearchDTO
  ): Observable<PublicEventTokenDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_PUBLIC_EVENT_SEARCH_RESULTS}`;
    return this.apiService.post<PublicEventTokenDTO[]>(
      requestMapping,
      searchDTO
    );
  }

  public retrievePublicEventToken(
    profileDTO: ProfileDTO
  ): Observable<PublicEventTokenDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_PUBLIC_EVENT_TOKEN}`;
    return this.apiService.post<PublicEventTokenDTO>(
      requestMapping,
      profileDTO
    );
  }

  public retrieveUserManagedPublicEvents(): Observable<PublicEventTokenDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_USER_MANAGED_PUBLIC_EVENTS_TOKENS}`;
    return this.apiService.get<PublicEventTokenDTO[]>(requestMapping);
  }

  public retrievePublicEventLocations(
    profileDTO: ProfileDTO
  ): Observable<PublicEventLocationDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_PUBLIC_EVENT_LOCATIONS}`;
    return this.apiService.post<PublicEventLocationDTO[]>(
      requestMapping,
      profileDTO
    );
  }

  public retrievePublicEventLocation(
    eventComponent: EventComponentDTO
  ): Observable<PublicEventLocationDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_PUBLIC_EVENT_LOCATION}`;
    return this.apiService.post<PublicEventLocationDTO>(
      requestMapping,
      eventComponent
    );
  }

  public retrieveEventLocationsTokens(
    profileDTO: ProfileDTO
  ): Observable<LocationTokenDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_EVENT_LOCATIONS_TOKENS}`;
    return this.apiService.post<LocationTokenDTO[]>(requestMapping, profileDTO);
  }

  public retrieveEventDatesTokens(
    profile: ProfileDTO
  ): Observable<DateTokenDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_EVENT_DATES_TOKENS}`;
    return this.apiService.post<DateTokenDTO[]>(requestMapping, profile);
  }

  public retrieveLocationDatesTokens(
    eventComponent: EventComponentDTO
  ): Observable<DateTokenDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_LOCATION_DATES_TOKENS}`;
    return this.apiService.post<DateTokenDTO[]>(requestMapping, eventComponent);
  }

  public retrieveEventDateProfile(
    eventComponent: EventComponentDTO
  ): Observable<EventDateProfileDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_EVENT_DATE_PROFILE}`;
    return this.apiService.post<EventDateProfileDTO>(
      requestMapping,
      eventComponent
    );
  }

  public retrievePublicEventFeatures(
    profile: ProfileDTO
  ): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_PUBLIC_EVENT_FEATURES}`;
    return this.apiService.post<ServiceProviderDTO[]>(requestMapping, profile);
  }

  public retrievePublicEventPrincipal(
    profile: ProfileDTO
  ): Observable<ServiceProviderDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_PUBLIC_EVENT_PRINCIPAL}`;
    return this.apiService.post<ServiceProviderDTO>(requestMapping, profile);
  }

  public savePublicEventDate(
    eventDate: EventComponentDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CREATE_USER_EVENT}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, eventDate);
  }

  public purchasePublicEventTickets(
    paymentTransaction: PaymentTransactionDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.PURCHASE_PUBLIC_EVENT_TICKETS}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      paymentTransaction
    );
  }

  public retrieveUserPublicEventToken(
    eventComponent: EventComponentDTO
  ): Observable<UserEventDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_USER_PUBLIC_EVENT_TOKEN}`;
    return this.apiService.post<UserEventDTO>(requestMapping, eventComponent);
  }

  public retrieveUserPublicEvent(
    eventComponent: EventComponentDTO
  ): Observable<UserPublicEventDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_USER_PUBLIC_EVENT}`;
    return this.apiService.post<UserPublicEventDTO>(
      requestMapping,
      eventComponent
    );
  }

  public scanUserTicket(
    ticketScan: TicketScanDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.SCAN_USER_TICKET}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, ticketScan);
  }

  public createGateCrew(
    providerRequests: ProviderRequestDTO[]
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.CREATE_GATE_CREW}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequests
    );
  }

  public updateGateCrew(
    providerRequests: ProviderRequestDTO[]
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.UPDATE_GATE_CREW}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequests
    );
  }

  public retrieveLocationGateCrew(
    eventLocation: EventComponentDTO
  ): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_LOCATION_GATE_CREW}`;
    return this.apiService.post<ServiceProviderDTO[]>(
      requestMapping,
      eventLocation
    );
  }

  public retrieveGateCrewLocationDates(
    eventProvider: EventProviderDTO
  ): Observable<DateTokenDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_GATE_CREW_LOCATION_DATES}`;
    return this.apiService.post<DateTokenDTO[]>(requestMapping, eventProvider);
  }

  public retrieveUserGateCrewDates(): Observable<DateTokenDTO[]> {
    const requestMapping: string = `${PublicEventsRestConstants.PUBLIC_EVENTS}/${PublicEventsRestConstants.RETRIEVE_USER_GATE_CREW_DATES}`;
    return this.apiService.get<DateTokenDTO[]>(requestMapping);
  }
}
