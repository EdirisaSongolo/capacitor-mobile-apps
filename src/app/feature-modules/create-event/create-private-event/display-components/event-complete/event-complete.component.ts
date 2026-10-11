import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  CreatePrivateEvent,
  PrivateEventTokenDTO,
  PrivateEventLocationDTO,
  CreatePrivateEventDTO,
} from '@app-core/private-events-core/api';
import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import { AppResponseService, BreakPointService } from '@domain-services/index';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  createPrivateEventStore,
  createPrivateEventProfile,
  CreatePrivateEventStore,
} from '@app-core/private-events-core/store/create-edit-event';
import { ProfileMapperService } from '@profile-accounts-core/services';
import { ProfileImageService } from '@media-core/services';
import { PrivateEventMappersService } from '@private-events-core/services';

@Component({
  selector: 'Tsk-event-complete',
  templateUrl: './event-complete.component.html',
  styleUrls: ['./event-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventCompleteComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public privateEventToken: PrivateEventTokenDTO;

  private profileImage: string | File;
  private eventMedia: File[] = [];
  private privateEvent: CreatePrivateEventDTO;

  private createPrivateEvent$: Observable<CreatePrivateEventStore> =
    this.store.select(createPrivateEventStore);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private profileMappers: ProfileMapperService,
    private privateEventMappers: PrivateEventMappersService,
    private profileImageService: ProfileImageService,
    private appResponse: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const createEventSub = this.createPrivateEvent$.subscribe(createEvent => {
      const privateEventLocation: PrivateEventLocationDTO = {
        eventVenue: createEvent.eventLocation?.eventVenue,
        eventCity: createEvent.eventLocation?.eventCity,
        eventState: createEvent.eventLocation?.eventState,
        eventCountry: createEvent.eventLocation?.eventCountry,
        eventLatitude: createEvent.eventLocation?.eventLatitude,
        eventLongitude: createEvent.eventLocation?.eventLongitude,
        eventTimeZone: createEvent.eventLocation?.eventTimeZone,
      };

      this.privateEventToken =
        this.privateEventMappers.createEventTokenDTO(createEvent);

      this.profileImage = createEvent.profileImage as File;
      if (this.profileImage) {
        this.profileImageService
          .readProfileImageFile(this.profileImage)
          .then(profileImageUrl => {
            this.privateEventToken = {
              ...this.privateEventToken,
              profileImage: profileImageUrl,
            };
          });
      }

      const features = createEvent.eventFeatures;
      const featureRequests = features.map(feature =>
        this.profileMappers.providerRequestDTOMapper(feature)
      );

      const staff = createEvent.eventStaff;
      const staffRequests = staff.map(staff =>
        this.profileMappers.providerRequestDTOMapper(staff)
      );

      this.eventMedia = createEvent.eventMedia;

      this.privateEvent = {
        eventName: createEvent.eventName,
        eventHost: createEvent.eventHost,
        startTime: createEvent.startTime,
        endTime: createEvent.endTime,
        eventDate: createEvent.eventDate,
        eventInvitation: createEvent.eventInvitation,
        eventLocation: privateEventLocation,
        eventFeatures: [...featureRequests],
        eventStaff: [...staffRequests],
        eventGuests: createEvent.eventGuests,
      };
    });

    this.subscriptions.add(createEventSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public createPrivateEventProfile(): void {
    if (
      !this.privateEvent.eventName?.trim() ||
      !this.profileImage ||
      !this.privateEvent.startTime ||
      !this.privateEvent.endTime ||
      !this.privateEvent.eventDate ||
      !this.privateEvent.eventInvitation?.trim() ||
      !this.privateEvent.eventLocation.eventLatitude ||
      !this.privateEvent.eventLocation.eventLongitude
    ) {
      this.appResponse.createAppResponse(AppResponseType.warning, [
        'create-event.private-event.notifications.invalid-private-event',
      ]);
      return;
    }

    const createPrivateEvent: CreatePrivateEvent = {
      profileImage: this.profileImage as File,
      eventMedia: this.eventMedia,
      privateEvent: this.privateEvent,
    };

    this.store.dispatch(
      createPrivateEventProfile({ createPrivateEvent: createPrivateEvent })
    );
  }
}
