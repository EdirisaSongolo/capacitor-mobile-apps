import { createReducer, on } from '@ngrx/store';
import {
  storeRecentMessages,
  storeUserNotifications,
  storeConversation,
  setChatContacts,
  appendUserNotification,
  updateConversation,
  updateRecentMessages,
  updateUserNotifications,
  storeEventPosts,
  appendEventPost,
} from '@communications-core/store/communications.actions';
import { CommunicationsStore } from '@communications-core/store/constants';
import { ChatProfileDTO, NotificationDTO } from '@communications-core/api';
import {
  NotificationAction,
  NotificationStatus,
} from '@communications-core/data-models';
import { ResourceReferenceDTO } from '@app-core/app-api';

const communications: CommunicationsStore = {
  userNotifications: [],
  recentMessages: [],
  conversation: {
    conversationId: null,
    chatProfiles: [],
    messages: [],
  },
  chatContacts: [],
  eventPosts: [],
};

export const communicationsReducer = createReducer(
  communications,
  on(storeUserNotifications, (state, { userNotifications }) => ({
    ...state,
    userNotifications: [...userNotifications],
  })),
  on(appendUserNotification, (state, { notification }) => ({
    ...state,
    userNotifications: [...state.userNotifications, notification],
  })),
  on(updateUserNotifications, (state, { action, resourceReference }) => ({
    ...state,
    userNotifications: updateNotifications(
      state.userNotifications,
      action,
      resourceReference
    ),
  })),
  on(storeRecentMessages, (state, { recentMessages }) => ({
    ...state,
    recentMessages: [...recentMessages],
  })),
  on(storeConversation, (state, { conversation }) => ({
    ...state,
    conversation: conversation,
  })),
  on(setChatContacts, (state, { chatContacts }) => ({
    ...state,
    chatContacts: [...chatContacts],
  })),
  on(updateConversation, (state, { message }) => {
    const conversation = state.conversation;

    if (!conversation) {
      return state;
    }

    const belongsToConversation: boolean = conversation.conversationId
      ? conversation.conversationId === message.conversationId
      : hasSameChatProfiles(conversation.chatProfiles, message.chatProfiles);

    if (!belongsToConversation) {
      return state;
    }

    return {
      ...state,
      conversation: {
        ...conversation,
        conversationId: conversation.conversationId ?? message.conversationId,
        messages: [...conversation.messages, message],
      },
    };
  }),
  on(updateRecentMessages, (state, { message }) => {
    const recentMessages = [...state.recentMessages];

    const messageIndex = recentMessages.findIndex(
      conversation => conversation.conversationId === message.conversationId
    );

    if (messageIndex !== -1) {
      recentMessages.splice(messageIndex, 1);
    }

    recentMessages.unshift(message);

    return {
      ...state,
      recentMessages,
    };
  }),
  on(storeEventPosts, (state, { eventPosts }) => ({
    ...state,
    eventPosts: [...eventPosts],
  })),
  on(appendEventPost, (state, { eventPost }) => ({
    ...state,
    eventPosts: [...state.eventPosts, eventPost],
  }))
);

const updateNotifications = (
  currentList: NotificationDTO[],
  action: NotificationAction,
  resourceReference: ResourceReferenceDTO
): NotificationDTO[] => {
  const updatedList: NotificationDTO[] = [];

  for (const userNotification of currentList) {
    if (userNotification.notificationId !== resourceReference.referenceId) {
      updatedList.push(userNotification);
      continue;
    }

    if (action === NotificationAction.delete_notification) {
      continue;
    }

    if (action === NotificationAction.update_status) {
      updatedList.push({
        ...userNotification,
        notificationStatus: NotificationStatus.viewed,
      });
    }
  }

  return updatedList;
};

const hasSameChatProfiles = (
  conversationProfiles: ChatProfileDTO[],
  messageProfiles: ChatProfileDTO[]
): boolean => {
  const conversationIds: string[] = conversationProfiles
    .map(chatProfile => chatProfile.userProfileId)
    .sort();
  const messageIds: string[] = (messageProfiles ?? [])
    .map(chatProfile => chatProfile.userProfileId)
    .sort();

  return (
    conversationIds.length > 0 &&
    conversationIds.length === messageIds.length &&
    conversationIds.every(
      (userProfileId, index) => userProfileId === messageIds[index]
    )
  );
};
