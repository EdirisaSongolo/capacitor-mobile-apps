export interface NotificationTokenDTO {
  notificationToken: string;
}

export interface NotificationDTO {
  notificationId: string;
  userProfileId: string;
  notificationMessage: string;
  notificationTopic: string;
  parameters: {
    topicId: string;
    profile: string;
    profileId: string;
    profileImage: string;
    profileName: string;
    time: string;
    date: string;
  };
  notificationStatus: string;
  timeStamp: string;
}

export interface ConversationDTO {
  conversationId: string;
  messages: MessageDTO[];
  chatProfiles: ChatProfileDTO[];
}

export interface MessageDTO {
  messageId?: string;
  conversationId: string;
  senderUserId: string;
  messageType: string;
  message: string;
  chatProfiles: ChatProfileDTO[];
  messageTimestamp?: string;
}

export interface ChatProfileDTO {
  userProfileId: string;
  profileImage: string;
  userName: string;
}

export interface EventPostDTO {
  postId?: string;
  eventType: string;
  eventReferenceId: string;
  senderUserId: string;
  senderProfile?: ChatProfileDTO;
  messageType: string;
  post: string;
  postTimestamp?: string;
}
