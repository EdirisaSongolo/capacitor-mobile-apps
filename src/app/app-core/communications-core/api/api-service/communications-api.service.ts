import { Injectable } from '@angular/core';
import { ApiService, ResourceReferenceDTO } from '@app-core/app-api';
import { EventTypes } from '@domain-data-models/app-domain.enums';
import { Observable } from 'rxjs';
import {
  NotificationDTO,
  CommunicationsRestConstants,
  NotificationTokenDTO,
  ConversationDTO,
  MessageDTO,
  EventPostDTO,
} from '@communications-core/api';

@Injectable({
  providedIn: 'root',
})
export class CommunicationsApiService {
  constructor(private apiService: ApiService) {}

  public evaluateNotificationToken(
    notificationToken: NotificationTokenDTO
  ): Observable<any> {
    const requestMapping: string = `${CommunicationsRestConstants.COMMUNICATIONS}/${CommunicationsRestConstants.EVALUATE_NOTIFICATIONS_TOKEN}`;
    return this.apiService.post(requestMapping, notificationToken);
  }

  public retrieveUserNotifications(): Observable<NotificationDTO[]> {
    const requestMapping: string = `${CommunicationsRestConstants.COMMUNICATIONS}/${CommunicationsRestConstants.RETRIEVE_USER_NOTIFICATIONS}`;
    return this.apiService.get<NotificationDTO[]>(requestMapping);
  }

  public updateNotificationStatus(
    resourceReference: ResourceReferenceDTO
  ): Observable<void> {
    const requestMapping: string = `${CommunicationsRestConstants.COMMUNICATIONS}/${CommunicationsRestConstants.UPDATE_NOTIFICATION_STATUS}`;
    return this.apiService.post<void>(requestMapping, resourceReference);
  }

  public deleteUserNotification(
    resourceReference: ResourceReferenceDTO
  ): Observable<void> {
    const requestMapping: string = `${CommunicationsRestConstants.COMMUNICATIONS}/${CommunicationsRestConstants.DELETE_USER_NOTIFICATION}`;
    return this.apiService.post<void>(requestMapping, resourceReference);
  }

  public retrieveRecentMessages(): Observable<MessageDTO[]> {
    const requestMapping = `${CommunicationsRestConstants.COMMUNICATIONS}/${CommunicationsRestConstants.RETRIEVE_RECENT_MESSAGES}`;
    return this.apiService.get<MessageDTO[]>(requestMapping);
  }

  public retrieveConversation(
    conversationDTO: ConversationDTO
  ): Observable<ConversationDTO> {
    const requestMapping = `${CommunicationsRestConstants.COMMUNICATIONS}/${CommunicationsRestConstants.RETRIEVE_CONVERSATION}`;
    return this.apiService.post<ConversationDTO>(
      requestMapping,
      conversationDTO
    );
  }

  public sendUserMessage(message: MessageDTO): Observable<MessageDTO[]> {
    const requestMapping = `${CommunicationsRestConstants.COMMUNICATIONS}/${CommunicationsRestConstants.SEND_USER_MESSAGE}`;
    return this.apiService.post<MessageDTO[]>(requestMapping, message);
  }

  public retrieveEventPosts(
    eventType: EventTypes,
    eventReferenceId: string
  ): Observable<EventPostDTO[]> {
    const requestMapping = `${CommunicationsRestConstants.COMMUNICATIONS}/${CommunicationsRestConstants.RETRIEVE_EVENT_POSTS}`;
    return this.apiService.post<EventPostDTO[]>(requestMapping, {
      eventType: eventType,
      eventReferenceId: eventReferenceId,
    });
  }
}
