import { Injectable } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import {
  FirebaseMessaging,
  NotificationReceivedEvent,
} from '@capacitor-firebase/messaging';
import { Store } from '@ngrx/store';
import { AppResponseType } from '@domain-data-models/app-domain.enums';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import {
  NotificationDTO,
  NotificationTokenDTO,
} from '@communications-core/api';
import {
  evaluateNotificationsToken,
  appendUserNotification,
} from '@communications-core/store';

@Injectable({
  providedIn: 'root',
})
export class NotificationsConfigService {
  private notificationsListener: Promise<PluginListenerHandle> | null = null;

  constructor(
    private store: Store,
    private appResponseService: AppResponseService
  ) {}

  public async establishHandshake(): Promise<void> {
    const notificationToken: NotificationTokenDTO =
      await this.retrieveNotificationToken();

    if (!notificationToken) {
      return;
    }

    this.store.dispatch(
      evaluateNotificationsToken({
        notificationToken: notificationToken,
      })
    );
  }

  public listenForNotifications(): void {
    if (this.notificationsListener) {
      return;
    }

    this.notificationsListener = FirebaseMessaging.addListener(
      'notificationReceived',
      (event: NotificationReceivedEvent) => {
        const data = event.notification.data as
          | { [key: string]: string }
          | undefined;
        const notification: NotificationDTO | any = data;
        const notificationType = data?.['title'];
        const notificationMessage = data?.['body'];

        if (notificationType === 'NOTIFICATION') {
          this.store.dispatch(
            appendUserNotification({ notification: notification })
          );
          this.appResponseService.createAppResponse(AppResponseType.success, [
            notificationMessage,
          ]);
        }
      }
    );
  }

  public stopListening(): void {
    void this.notificationsListener?.then(handle => handle.remove());
    this.notificationsListener = null;
  }

  public async retrieveNotificationToken(): Promise<NotificationTokenDTO> {
    try {
      const { receive } = await FirebaseMessaging.requestPermissions();

      if (receive !== 'granted') {
        const messages: string[] = ['notifications.notifications-blocked'];
        this.appResponseService.createAppResponse(
          AppResponseType.warning,
          messages
        );
        return undefined;
      }

      const { token } = await FirebaseMessaging.getToken();

      const notificationToken: NotificationTokenDTO = {
        notificationToken: token,
      };
      return notificationToken;
    } catch {
      const messages: string[] = ['notifications.notifications-disabled'];
      this.appResponseService.createAppResponse(
        AppResponseType.warning,
        messages
      );
      return undefined;
    }
  }
}
