import { createAction, props } from '@ngrx/store';
import {
  ChatProfileDTO,
  ConversationDTO,
  EventPostDTO,
  MessageDTO,
  NotificationDTO,
  NotificationTokenDTO,
} from '@communications-core/api/communications.dto-models';
import { ResourceReferenceDTO } from '@app-core/app-api';
import { NotificationAction } from '@communications-core/data-models';
import { EventTypes } from '@domain-data-models/app-domain.enums';

export const EVALUATE_NOTIFICATIONS_TOKEN =
  '[Notifications config] Evaluate notifications token and establish connection';
export const evaluateNotificationsToken = createAction(
  EVALUATE_NOTIFICATIONS_TOKEN,
  props<{ notificationToken: NotificationTokenDTO }>()
);

export const RETRIEVE_USER_NOTIFICATIONS =
  '[Notifications] Retrieve user notifications';
export const retrieveUserNotifications = createAction(
  RETRIEVE_USER_NOTIFICATIONS
);

export const STORE_USER_NOTIFICATIONS =
  '[Notifications] Store user notifications';
export const storeUserNotifications = createAction(
  STORE_USER_NOTIFICATIONS,
  props<{ userNotifications: NotificationDTO[] }>()
);

export const APPEND_USER_NOTIFICATION =
  '[Notifications] Append user notification';
export const appendUserNotification = createAction(
  APPEND_USER_NOTIFICATION,
  props<{ notification: NotificationDTO }>()
);

export const UPDATE_NOTIFICATION_STATUS =
  '[Notifications] Update notification status';
export const updateNotificationStatus = createAction(
  UPDATE_NOTIFICATION_STATUS,
  props<{ resourceReference: ResourceReferenceDTO }>()
);

export const DELETE_USER_NOTIFICATION =
  '[Notifications] Delete user notification';
export const deleteUserNotification = createAction(
  DELETE_USER_NOTIFICATION,
  props<{ resourceReference: ResourceReferenceDTO }>()
);

export const UPDATE_USER_NOTIFICATIONS =
  '[Notifications] Update user notifications';
export const updateUserNotifications = createAction(
  UPDATE_USER_NOTIFICATIONS,
  props<{
    action: NotificationAction;
    resourceReference: ResourceReferenceDTO;
  }>()
);

export const RETRIEVE_RECENT_MESSAGES = '[Messaging] Retrieve recent messages';
export const retrieveRecentMessages = createAction(RETRIEVE_RECENT_MESSAGES);

export const STORE_RECENT_MESSAGES = '[Messaging] Store recent Messages';
export const storeRecentMessages = createAction(
  STORE_RECENT_MESSAGES,
  props<{
    recentMessages: MessageDTO[];
  }>()
);

export const RETRIEVE_CONVERSATION = '[Messaging] Retrieve conversation';
export const retrieveConversation = createAction(
  RETRIEVE_CONVERSATION,
  props<{ conversationDTO: ConversationDTO }>()
);

export const STORE_CONVERSATION = '[Messaging] Store conversation';
export const storeConversation = createAction(
  STORE_CONVERSATION,
  props<{ conversation: ConversationDTO }>()
);

export const SET_CHAT_CONTACTS = '[Messaging] Set chat contacts';
export const setChatContacts = createAction(
  SET_CHAT_CONTACTS,
  props<{ chatContacts: ChatProfileDTO[] }>()
);

export const UPDATE_CONVERSATION = '[Messaging] Update conversation';
export const updateConversation = createAction(
  UPDATE_CONVERSATION,
  props<{ message: MessageDTO }>()
);

export const UPDATE_RECENT_MESSAGES = '[Messaging] Update recent messages';
export const updateRecentMessages = createAction(
  UPDATE_RECENT_MESSAGES,
  props<{ message: MessageDTO }>()
);

export const SEND_USER_MESSAGE = '[Messaging] Send user message';
export const sendUserMessage = createAction(
  SEND_USER_MESSAGE,
  props<{ message: MessageDTO }>()
);

export const RETRIEVE_EVENT_POSTS = '[Event posts] Retrieve event posts';
export const retrieveEventPosts = createAction(
  RETRIEVE_EVENT_POSTS,
  props<{ eventType: EventTypes; eventReferenceId: string }>()
);

export const STORE_EVENT_POSTS = '[Event posts] Store event posts';
export const storeEventPosts = createAction(
  STORE_EVENT_POSTS,
  props<{ eventPosts: EventPostDTO[] }>()
);

export const APPEND_EVENT_POST = '[Event posts] Append event post';
export const appendEventPost = createAction(
  APPEND_EVENT_POST,
  props<{ eventPost: EventPostDTO }>()
);
