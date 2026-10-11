import { NotificationTopic } from '@communications-core/data-models/communications.enums';

export interface UserNotification {
  notificationId: string;
  topicId: string;
  profileImage: string;
  notification: string;
  notificationTopic: NotificationTopic;
}
