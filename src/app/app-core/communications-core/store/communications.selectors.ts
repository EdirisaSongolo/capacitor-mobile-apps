import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  COMMUNICATIONS,
  CommunicationsStore,
} from '@communications-core/store/constants';

export const CommunicationsFeature =
  createFeatureSelector<CommunicationsStore>(COMMUNICATIONS);

export const userNotificationsSelector = createSelector(
  CommunicationsFeature,
  communications => communications?.userNotifications
);

export const recentMessagesSelector = createSelector(
  CommunicationsFeature,
  communications => communications?.recentMessages
);

export const conversationSelector = createSelector(
  CommunicationsFeature,
  communications => communications.conversation
);

export const chatContactsSelector = createSelector(
  CommunicationsFeature,
  communications => communications?.chatContacts
);

export const eventPostsSelector = createSelector(
  CommunicationsFeature,
  communications => communications?.eventPosts
);
