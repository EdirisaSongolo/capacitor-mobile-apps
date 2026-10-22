import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService, DateTimeService } from '@domain-services/index';
import { LocationMappersService } from '@domain-services/mappers';
import { ProfileDTO } from '@app-core/app-api';
import {
  EventComponentDTO,
  EventDetailsDTO,
  PublicEventDateDTO,
  UserPublicEventDTO,
} from '@public-events-core/api';
import {
  retrieveUserPublicEvent,
  userPublicEventSelector,
} from '@public-events-core/store';
import { VenueTokenDTO } from '@venues-core/api';

import {
  EventComponents,
  PublicEventConstants,
  UserPublicEventDisplay,
  UserPublicEventRoutes,
} from '@public-events-core/data-models';
import { setComponentAction, setProfileDTO } from '@app-domain/store';

@Component({
  selector: 'Tsk-user-public-event',
  templateUrl: './user-public-event.component.html',
  styleUrls: ['./user-public-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserPublicEventComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public userEventControls: UserPublicEventDisplay[] = [
    {
      name: 'media',
      icon: 'dashboard_2',
      route: UserPublicEventRoutes.MEDIA,
    },
    {
      name: 'tickets',
      icon: 'confirmation_number',
      route: UserPublicEventRoutes.USER_TICKETS,
    },
    {
      name: 'communications',
      icon: 'chat_bubble_outline',
      route: UserPublicEventRoutes.EVENT_POSTS,
    },
    {
      name: 'date-profile',
      icon: 'event_list',
      route: UserPublicEventRoutes.FEATURES,
    },
  ];

  public publicEventDate: PublicEventDateDTO;
  public venueToken: VenueTokenDTO;

  public profileImage: string = `${PublicEventConstants.DEFAULT_PROFILE_IMAGE} center center / contain no-repeat`;
  public eventName: string;
  public eventDate: string;
  public eventTime: string;
  public venueAddress: string;

  private eventComponent: EventComponentDTO;
  private userPublicEvent: UserPublicEventDTO;
  private eventDetails: EventDetailsDTO;

  private userPublicEvent$: Observable<UserPublicEventDTO> = this.store.select(
    userPublicEventSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private locationMappers: LocationMappersService,
    private dateTimeService: DateTimeService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const routerSub = this.activatedRoute.paramMap.subscribe(parameters => {
      const publicEventDateId = parameters.get('publicEventDateId');

      this.eventComponent = {
        component: EventComponents.event_date,
        componentId: publicEventDateId,
      };

      this.store.dispatch(
        retrieveUserPublicEvent({ eventComponent: this.eventComponent })
      );
    });

    this.subscriptions.add(routerSub);

    const userPublicEventSub = this.userPublicEvent$.subscribe(
      userPublicEvent => {
        if (userPublicEvent) {
          this.userPublicEvent = userPublicEvent;
          this.processUserPublicEvent(this.userPublicEvent);

          const profileDTO: ProfileDTO = {
            profile: Profiles.publicEventProfile,
            profileId: this.userPublicEvent.eventDetails.eventId,
          };
          this.store.dispatch(
            setComponentAction({ componentAction: ComponentAction.profile })
          );
          this.store.dispatch(setProfileDTO({ profileDTO: profileDTO }));
        }
      }
    );

    this.subscriptions.add(userPublicEventSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public switchUserEventsDisplay(displayOption: UserPublicEventDisplay): void {
    const route = displayOption.route;
    this.router.navigate([route], { relativeTo: this.activatedRoute });
  }

  private processUserPublicEvent(userPublicEvent: UserPublicEventDTO): void {
    this.eventDetails = userPublicEvent.eventDetails;
    this.eventName = this.eventDetails.eventName;

    if (this.eventDetails?.profileImage) {
      const imagePath = this.eventDetails.profileImage;
      this.profileImage = `url(${imagePath}) center center / contain no-repeat`;
    }

    const publicEventDate = userPublicEvent.publicEventDate;
    this.publicEventDate = { ...publicEventDate };
    this.venueToken = this.publicEventDate.dateVenue;

    const locationDTO = this.venueToken.venueLocation;
    if (locationDTO?.address) {
      this.venueAddress =
        this.locationMappers.mapLocationDTOAddress(locationDTO);
    }

    this.eventDate = this.dateTimeService.processApiDateResponse(
      this.publicEventDate.eventDate
    );

    this.eventTime = this.dateTimeService.processApiTimeRangeResponse(
      this.publicEventDate.startTime,
      this.publicEventDate.endTime
    );
  }
}
