import { environment } from '@environments/environment';

export class ApiRestConstants {
  public static readonly API_INGRESS = environment.apiIngress;
  public static readonly TUUSKA = 'tuuska';
  public static readonly API = 'api';
  public static readonly COMMUNICATIONS = 'communications';
  public static readonly MESSAGING = 'messaging';
  public static readonly MESSAGE_HANDLER = 'message-handler';
  public static readonly SEND_USER_MESSAGE = 'send-user-message';
  public static readonly SEND_EVENT_POST = 'send-event-post';
  public static readonly USER = 'user';
  public static readonly QUEUE = 'queue';
  public static readonly USER_MESSAGES = 'user-messages';
  public static readonly TOPIC = 'topic';
  public static readonly EVENT_POSTS = 'event-posts';
  public static readonly CONTENT_TYPE = 'Content-Type';
  public static readonly APPLICATION_JSON = 'application/json';
  public static readonly MULTI_FORM_PART_DATA = 'multipart/form-data';
  public static readonly REVENUE_ACCOUNT_ID = 'Revenue-Account-Id';
}
