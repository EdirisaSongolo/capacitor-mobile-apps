import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import {
  DateTokenDTO,
  EventComponentDTO,
  PublicEventTokenDTO,
} from '@public-events-core/api';
import {
  DatesDisplay,
  EventComponents,
  ProfileDisplayPanel,
  PublicEventRoutes,
} from '@public-events-core/data-models';

import { ProfileDTO } from '@app-core/app-api';
import {
  publicEventDatesSelector,
  publicEventTokenSelector,
  retrieveLocationDatesTokens,
  retrieveEventDatesTokens,
  datesDisplaySelector,
  eventComponentSelector,
} from '@public-events-core/store';
import { profileDTOSelector } from '@app-domain/store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'Tsk-public-event-profile-dates',
  templateUrl: './public-event-profile-dates.component.html',
  styleUrls: ['./public-event-profile-dates.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventProfileDatesComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayPanel: ProfileDisplayPanel = ProfileDisplayPanel.dates;
  public panelOptions: typeof ProfileDisplayPanel = ProfileDisplayPanel;
  public eventDatesTokens: DateTokenDTO[] = [];
  public profileImage: string;

  private profileDTO: ProfileDTO;
  private eventComponent: EventComponentDTO;

  private publicEvent$: Observable<PublicEventTokenDTO> = this.store.select(
    publicEventTokenSelector
  );
  private publicEventDates$: Observable<DateTokenDTO[]> = this.store.select(
    publicEventDatesSelector
  );
  private eventComponent$: Observable<EventComponentDTO> = this.store.select(
    eventComponentSelector
  );
  private datesDisplay$: Observable<DatesDisplay> =
    this.store.select(datesDisplaySelector);
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

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
      }
    });

    this.subscriptions.add(profileDTOSub);

    const eventComponentSub = this.eventComponent$.subscribe(eventComponent => {
      if (eventComponent) {
        this.eventComponent = eventComponent;
      }
    });

    this.subscriptions.add(eventComponentSub);

    const datesDisplaySub = this.datesDisplay$.subscribe(datesDisplay => {
      if (
        datesDisplay &&
        datesDisplay === DatesDisplay.location_dates &&
        this.eventComponent.component === EventComponents.event_location
      ) {
        this.store.dispatch(
          retrieveLocationDatesTokens({ eventComponent: this.eventComponent })
        );
      } else {
        this.store.dispatch(
          retrieveEventDatesTokens({ profile: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(datesDisplaySub);

    const publicEventDatesSub = this.publicEventDates$.subscribe(
      publicEventDates => {
        if (publicEventDates) {
          this.eventDatesTokens = [...publicEventDates];
        }
      }
    );

    this.subscriptions.add(publicEventDatesSub);

    const publicEventSub = this.publicEvent$.subscribe(publicEvent => {
      if (publicEvent) {
        this.profileImage = publicEvent?.profileImage;
      }
    });

    this.subscriptions.add(publicEventSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayDateDetails(publicEventDate: DateTokenDTO): void {
    this.router.navigate(
      [`../${PublicEventRoutes.EVENT_DATE}`, publicEventDate.dateId],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }

  //create method to navifate to date pdetails page if only one date
}
