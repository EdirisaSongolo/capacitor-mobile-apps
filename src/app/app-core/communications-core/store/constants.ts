import {
  ChatProfileDTO,
  ConversationDTO,
  EventPostDTO,
  MessageDTO,
} from '@communications-core/api/communications.dto-models';

export const COMMUNICATIONS = 'Communications';

export interface CommunicationsStore {
  userNotifications: any[];
  recentMessages: MessageDTO[];
  conversation: ConversationDTO;
  chatContacts: ChatProfileDTO[];
  eventPosts: EventPostDTO[];
}
