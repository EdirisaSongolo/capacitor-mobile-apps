import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  ComponentAction,
  Device,
  EventTypes,
  UserEventAccess,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { ProfileDTO, UserEventDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';

import {
  retrieveUserEvents,
  setUserEvent,
  userEventsSelector,
} from '@profile-accounts-core/store';

import {
  EventComponentDTO,
  PublicEventTokenDTO,
} from '@public-events-core/api';
import { PrivateEventTokenDTO } from '@private-events-core/api';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAccountRoutes } from '@user-profile-core/data-models';

enum UserEvents {
  events_list = 'EVENTS_LIST',
  public_event = 'PUBLIC_EVENT',
  private_event = 'PRIVATE_EVENT',
}

@Component({
  selector: 'Tsk-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserEventsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public eventsDisplay: UserEvents = UserEvents.events_list;
  public displayOptions: typeof UserEvents = UserEvents;

  public componentAction: ComponentAction = ComponentAction.profile;
  public eventTypes: typeof EventTypes = EventTypes;
  public userEvents: UserEventDTO[] = [];

  public eventComponent: EventComponentDTO;
  public profileDTO: ProfileDTO;

  private userEvents$: Observable<UserEventDTO[]> =
    this.store.select(userEventsSelector);
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.store.dispatch(retrieveUserEvents());
      }
    });

    this.subscriptions.add(profileSub);

    const userEventsSub = this.userEvents$.subscribe(userEvents => {
      if (userEvents.length >= 1) {
        this.userEvents = [...userEvents];
      }
    });

    this.subscriptions.add(userEventsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public asPublicEventToken(userEvent: UserEventDTO): PublicEventTokenDTO {
    return userEvent as PublicEventTokenDTO;
  }

  public asPrivateEventToken(userEvent: UserEventDTO): PrivateEventTokenDTO {
    return userEvent as PrivateEventTokenDTO;
  }

  public processEventPlacAction(userEvent: UserEventDTO): void {
    this.store.dispatch(setUserEvent({ userEvent: userEvent }));

    if (userEvent.eventType === EventTypes.publicEvent) {
      this.processPublicEvent(userEvent);
    } else if (userEvent.eventType === EventTypes.privateEvent) {
      this.processPrivateEvent(userEvent);
    }
  }

  private processPublicEvent(userEvent: UserEventDTO): void {
    const userAccess = userEvent.userAccess;
    const publicEventToken: PublicEventTokenDTO =
      userEvent as PublicEventTokenDTO;
    const eventDateId = publicEventToken.tokenLocationDate.dateId;

    if (userAccess === UserEventAccess.saved) {
      this.router.navigate(
        [`../${UserAccountRoutes.SAVED_EVENT_DATE}`, eventDateId],
        {
          relativeTo: this.activatedRoute,
        }
      );
    } else if (userAccess === UserEventAccess.ticketed) {
      this.router.navigate([UserAccountRoutes.USER_PUBLIC_EVENT, eventDateId]);
    }
  }

  private processPrivateEvent(userEvent: UserEventDTO): void {
    const userAccess = userEvent.userAccess;
    const privateEventToken = userEvent as PrivateEventTokenDTO;
    const privateEventId = privateEventToken.eventId;

    if (userAccess === UserEventAccess.invited) {
      this.router.navigate(
        [`../${UserAccountRoutes.EVENT_INVITATION}`, privateEventId],
        {
          relativeTo: this.activatedRoute,
        }
      );
    } else if (userAccess === UserEventAccess.confirmed) {
      this.router.navigate([
        UserAccountRoutes.USER_PRIVATE_EVENT,
        privateEventId,
      ]);
    }
  }
}
