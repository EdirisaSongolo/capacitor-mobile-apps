import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiService,
  ProfileDTO,
  ProviderRequestDTO,
  SuccessResponseDTO,
} from '@app-core/app-api';

import {
  CreatePrivateEvent,
  EventUpdateDTO,
  InvitationDTO,
  InviteResponseDTO,
  PrivateEventGuestDTO,
  PrivateEventLocationDTO,
  PrivateEventsRestConstants,
  UserPrivateEventDTO,
} from '@private-events-core/api';

import { PrivateEventTokenDTO } from '@private-events-core/api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';

@Injectable({
  providedIn: 'root',
})
export class PrivateEventsApiService {
  constructor(private apiService: ApiService) {}

  public createPrivateEventProfile(
    createPrivateEvent: CreatePrivateEvent
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.CREATE_PRIVATE_EVENT_PROFILE}`;

    const privateEventFormData: FormData = new FormData();
    privateEventFormData.append(
      'profileImage',
      createPrivateEvent.profileImage
    );
    createPrivateEvent.eventMedia.forEach(file =>
      privateEventFormData.append('eventMedia', file, file.name)
    );
    privateEventFormData.append(
      'privateEvent',
      JSON.stringify(createPrivateEvent.privateEvent)
    );

    return this.apiService.multiPartPost<SuccessResponseDTO>(
      requestMapping,
      privateEventFormData
    );
  }

  public retrieveUserManagedPrivateEvents(): Observable<
    PrivateEventTokenDTO[]
  > {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_USER_MANAGED_PRIVATE_EVENTS}`;
    return this.apiService.get<PrivateEventTokenDTO[]>(requestMapping);
  }

  public retrievePrivateEventToken(
    profileDTO: ProfileDTO
  ): Observable<PrivateEventTokenDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_PRIVATE_EVENT_TOKEN}`;
    return this.apiService.post<PrivateEventTokenDTO>(
      requestMapping,
      profileDTO
    );
  }

  public updatePrivateEventDetails(
    eventUpdateDTO: EventUpdateDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.UPDATE_PRIVATE_EVENT_DETAILS}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      eventUpdateDTO
    );
  }

  public cancelPrivateEvent(
    profileDTO: ProfileDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.CANCEL_PRIVATE_EVENT}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, profileDTO);
  }

  public retrievePrivateEventLocation(
    profileDTO: ProfileDTO
  ): Observable<PrivateEventLocationDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_PRIVATE_EVENT_LOCATION}`;
    return this.apiService.post<PrivateEventLocationDTO>(
      requestMapping,
      profileDTO
    );
  }

  public updatePrivateEventLocation(
    eventLocation: PrivateEventLocationDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.UPDATE_PRIVATE_EVENT_LOCATION}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      eventLocation
    );
  }

  public retrievePrivateEventFeatures(
    profileDTO: ProfileDTO
  ): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_PRIVATE_EVENT_FEATURES}`;
    return this.apiService.post<ServiceProviderDTO[]>(
      requestMapping,
      profileDTO
    );
  }

  public createPrivateEventFeature(
    providerRequest: ProviderRequestDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.CREATE_PRIVATE_EVENT_FEATURE}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequest
    );
  }

  public cancelPrivateEventFeature(
    providerRequest: ProviderRequestDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.CANCEL_PRIVATE_EVENT_FEATURE}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequest
    );
  }

  public retrievePrivateEventStaff(
    profileDTO: ProfileDTO
  ): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_PRIVATE_EVENT_STAFF}`;
    return this.apiService.post<ServiceProviderDTO[]>(
      requestMapping,
      profileDTO
    );
  }

  public createPrivateEventStaff(
    providerRequest: ProviderRequestDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.CREATE_PRIVATE_EVENT_STAFF}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequest
    );
  }

  public cancelPrivateEventStaff(
    providerRequest: ProviderRequestDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.CANCEL_PRIVATE_EVENT_STAFF}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      providerRequest
    );
  }

  public retrievePrivateEventGuests(
    profileDTO: ProfileDTO
  ): Observable<PrivateEventGuestDTO[]> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_PRIVATE_EVENT_GUESTS}`;
    return this.apiService.post<PrivateEventGuestDTO[]>(
      requestMapping,
      profileDTO
    );
  }

  public createPrivateEventGuest(
    invitation: PrivateEventGuestDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.CREATE_PRIVATE_EVENT_GUEST}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, invitation);
  }

  public removePrivateEventGuest(
    invitation: PrivateEventGuestDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.REMOVE_PRIVATE_EVENT_GUEST}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, invitation);
  }

  public retrieveUserPrivateEventToken(
    profileDTO: ProfileDTO
  ): Observable<PrivateEventTokenDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_USER_PRIVATE_EVENT_TOKEN}`;
    return this.apiService.post<PrivateEventTokenDTO>(
      requestMapping,
      profileDTO
    );
  }

  public retrieveUserInvitation(
    profileDTO: ProfileDTO
  ): Observable<InvitationDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_USER_INVITATION}`;
    return this.apiService.post<InvitationDTO>(requestMapping, profileDTO);
  }

  public updateInvitationStatus(
    inviteResponse: InviteResponseDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.UPDATE_INVITATION_STATUS}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      inviteResponse
    );
  }

  public retrieveUserPrivateEvent(
    profileDTO: ProfileDTO
  ): Observable<UserPrivateEventDTO> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_USER_PRIVATE_EVENT}`;
    return this.apiService.post<UserPrivateEventDTO>(
      requestMapping,
      profileDTO
    );
  }

  public retrieveEventGuests(
    profileDTO: ProfileDTO
  ): Observable<UserTokenDTO[]> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_EVENT_GUESTS}`;
    return this.apiService.post<UserTokenDTO[]>(requestMapping, profileDTO);
  }

  public retrieveEventFeatures(
    profileDTO: ProfileDTO
  ): Observable<ServiceProviderDTO[]> {
    const requestMapping: string = `${PrivateEventsRestConstants.PRIVATE_EVENTS}/${PrivateEventsRestConstants.RETRIEVE_EVENT_FEATURES}`;
    return this.apiService.post<ServiceProviderDTO[]>(
      requestMapping,
      profileDTO
    );
  }
}
