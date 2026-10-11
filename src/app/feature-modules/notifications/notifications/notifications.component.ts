import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { BreakPointService, DateTimeService } from '@domain-services/index';
import {
  Device,
  Profiles,
  ReferencedResources,
} from '@domain-data-models/app-domain.enums';
import { ResourceReferenceDTO } from '@app-core/app-api';
import { setComponentResource } from '@app-domain/store';
import { ProfileImageService } from '@media-core/services/profile-image/profile-image.service';

import {
  NotificationTopic,
  NotificationDTO,
  UserNotification,
} from '@communications-core/index';
import {
  deleteUserNotification,
  retrieveUserNotifications,
  storeUserNotifications,
  updateNotificationStatus,
  userNotificationsSelector,
} from '@communications-core/store';
import { UserAccountRoutes } from '@user-profile-core/data-models/user-account.routes';

@Component({
  selector: 'Tsk-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public notificationTopicOptions: typeof NotificationTopic = NotificationTopic;
  public userNotifications: UserNotification[] = [];
  public removeIcon: string = 'delete';
  public userNotification: UserNotification;

  private notifications: NotificationDTO[] = [];
  private notifications$: Observable<NotificationDTO[]> = this.store.select(
    userNotificationsSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router,
    private translator: TranslateService,
    private profileImageService: ProfileImageService,
    private dateTimeService: DateTimeService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    this.store.dispatch(storeUserNotifications({ userNotifications: [] }));
    this.store.dispatch(retrieveUserNotifications());

    const notificationsSub = this.notifications$.subscribe(notifications => {
      if (notifications.length >= 1) {
        this.notifications = [...notifications];
        const userNotifications: UserNotification[] =
          this.processUserNotifications();
        this.userNotifications = [...userNotifications];
      }
    });

    this.subscriptions.add(notificationsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayNotificationDetails(userNotification: UserNotification): void {
    this.userNotification = userNotification;

    if (
      this.userNotification.notificationTopic ===
      this.notificationTopicOptions.profile_booking
    ) {
      const componentResource: ResourceReferenceDTO = {
        resource: ReferencedResources.profileBooking,
        referenceId: userNotification.topicId,
      };

      this.store.dispatch(
        setComponentResource({ componentResource: componentResource })
      );

      const resourceReference: ResourceReferenceDTO = {
        resource: ReferencedResources.profileBooking,
        referenceId: userNotification.notificationId,
      };
      this.store.dispatch(
        updateNotificationStatus({ resourceReference: resourceReference })
      );

      this.router.navigate([
        `${UserAccountRoutes.HOME}/${UserAccountRoutes.BOOKING_REQUEST}`,
        userNotification.topicId,
      ]);
    }
  }

  public deleteNotification(userNotification: UserNotification): void {
    const resourceReference: ResourceReferenceDTO = {
      resource: ReferencedResources.profileBooking,
      referenceId: userNotification.notificationId,
    };

    this.store.dispatch(
      deleteUserNotification({ resourceReference: resourceReference })
    );
  }

  private processUserNotifications(): UserNotification[] {
    const userNotifications: UserNotification[] = [];

    this.notifications.forEach(notification => {
      let parameters = notification.parameters;
      const date = parameters.date;
      const time = parameters.time;

      parameters = {
        ...parameters,
        date: this.dateTimeService.processApiDateResponse(date),
        time: this.dateTimeService.processApiTimeResponse(time),
      };

      const userNotitication = this.translator.instant(
        notification.notificationMessage,
        parameters
      );

      const topicId = parameters.topicId;
      const profileImage = parameters.profileImage;
      const profile = parameters.profile as Profiles;
      const imageUrl = profileImage
        ? `url(${profileImage}) center / contain no-repeat`
        : this.profileImageService.defaultProfileImage(profile);

      const userNotification: UserNotification = {
        notificationId: notification.notificationId,
        topicId: topicId,
        profileImage: imageUrl,
        notification: userNotitication,
        notificationTopic: notification.notificationTopic as NotificationTopic,
      };

      userNotifications.push(userNotification);
    });

    return userNotifications;
  }
}
