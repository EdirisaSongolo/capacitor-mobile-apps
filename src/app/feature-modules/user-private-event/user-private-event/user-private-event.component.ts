import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import {
  ComponentAction,
  Device,
  EventTypes,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService, DateTimeService } from '@domain-services/index';
import { UserPrivateEventDTO } from '@private-events-core/api';
import {
  retrieveUserPrivateEvent,
  userPrivateEventSelector,
} from '@private-events-core/store';

import { VenueTokenDTO } from '@venues-core/api/venues.dto-models';
import {
  PrivateEventConstants,
  VenueType,
} from '@private-events-core/data-models';
import { ProfileDTO } from '@app-core/app-api';
import { LocationMappersService } from '@domain-services/mappers';
import { setComponentAction, setProfileDTO } from '@app-domain/store';

enum UserEventDisplay {
  media = 'MEDIA',
  messaging = 'MESSAGING',
  guests = 'GUESTS',
  providers = 'PROVIDERS',
}

@Component({
  selector: 'Tsk-user-private-event',
  templateUrl: './user-private-event.component.html',
  styleUrls: ['./user-private-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserPrivateEventComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public eventTypes: typeof EventTypes = EventTypes;
  public eventId: string;

  public profileImage: string = `${PrivateEventConstants.DEFAULT_PROFILE_IMAGE} center center / contain no-repeat`;
  public eventName: string;
  public eventDate: string;
  public eventTime: string;

  public venueOptions: typeof VenueType = VenueType;
  public venueType: VenueType;
  public venueAddress: string;
  public venueToken: VenueTokenDTO;

  public userEventDisplay: UserEventDisplay = UserEventDisplay.media;
  public displayOptions: typeof UserEventDisplay = UserEventDisplay;
  public userEventControls: any[] = [
    {
      name: 'media',
      icon: 'dashboard_2',
      display: this.displayOptions.media,
    },
    {
      name: 'messaging',
      icon: 'chat_bubble_outline',
      display: this.displayOptions.messaging,
    },
    {
      name: 'guests',
      icon: 'stacks',
      display: this.displayOptions.guests,
    },
    {
      name: 'providers',
      icon: 'event_list',
      display: this.displayOptions.providers,
    },
  ];

  private userPrivateEvent: UserPrivateEventDTO;

  private userPrivateEvent$: Observable<UserPrivateEventDTO> =
    this.store.select(userPrivateEventSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private dateTimeService: DateTimeService,
    private locationMappersService: LocationMappersService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const routerSub = this.activatedRoute.paramMap.subscribe(parameters => {
      const privateEventId = parameters.get('privateEventId');
      this.eventId = privateEventId;

      const profileDTO: ProfileDTO = {
        profile: Profiles.privateEventProfile,
        profileId: privateEventId,
      };

      this.store.dispatch(
        setComponentAction({ componentAction: ComponentAction.profile })
      );
      this.store.dispatch(setProfileDTO({ profileDTO: profileDTO }));
      this.store.dispatch(retrieveUserPrivateEvent({ profileDTO: profileDTO }));
    });

    this.subscriptions.add(routerSub);

    const userPrivateEventSub = this.userPrivateEvent$.subscribe(
      userPrivateEvent => {
        if (userPrivateEvent) {
          this.userPrivateEvent = userPrivateEvent;
          this.processUserPrivateEvent(this.userPrivateEvent);
        }
      }
    );

    this.subscriptions.add(userPrivateEventSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public switchUserEventsDisplay(displayOption: UserEventDisplay): void {
    this.userEventDisplay = displayOption;
  }

  private processUserPrivateEvent(userPrivateEvent: UserPrivateEventDTO): void {
    if (userPrivateEvent?.profileImage) {
      const imagePath = userPrivateEvent.profileImage;
      this.profileImage = `url(${imagePath}) center center / contain no-repeat`;
    }

    this.eventName = userPrivateEvent.eventName;

    this.eventTime = this.dateTimeService.processApiTimeRangeResponse(
      userPrivateEvent.startTime,
      userPrivateEvent.endTime
    );

    this.eventDate = this.dateTimeService.processApiDateResponse(
      userPrivateEvent.eventDate
    );

    const eventLocation = userPrivateEvent.eventLocation;
    const eventVenue = eventLocation.eventVenue;
    this.venueType = eventVenue.venueType;
    if (this.venueType === VenueType.public_venue) {
      this.venueToken = eventVenue.publicVenue;
      const venueLocation = this.venueToken.venueLocation;
      this.venueAddress =
        this.locationMappersService.mapLocationDTOAddress(venueLocation);
    } else if (this.venueType === VenueType.private_venue) {
      this.venueAddress = eventVenue.privateAddress;
    }
  }
}
