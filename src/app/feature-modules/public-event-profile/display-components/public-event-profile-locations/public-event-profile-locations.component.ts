import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ProfileDTO } from '@app-core/app-api';

import {
  LocationTokenDTO,
  PublicEventTokenDTO,
  EventComponentDTO,
} from '@public-events-core/api';
import {
  DatesDisplay,
  EventComponents,
  ProfileDisplayPanel,
  PublicEventRoutes,
} from '@public-events-core/data-models';
import {
  publicEventLocationsSelector,
  publicEventTokenSelector,
  retrieveEventLocationsTokens,
  setDatesDisplay,
  setEventComponent,
} from '@public-events-core/store';

import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { profileDTOSelector } from '@app-domain/store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'Tsk-public-event-profile-locations',
  templateUrl: './public-event-profile-locations.component.html',
  styleUrls: ['./public-event-profile-locations.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventProfileLocationsComponent implements OnInit, OnDestroy {
  @Output() public selectedLocation: EventEmitter<LocationTokenDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayPanel: ProfileDisplayPanel = ProfileDisplayPanel.locations;
  public panelOptions: typeof ProfileDisplayPanel = ProfileDisplayPanel;

  public profileImage: string;
  public locationsTokens: LocationTokenDTO[] = [];

  private profileDTO: ProfileDTO;

  private publicEvent$: Observable<PublicEventTokenDTO> = this.store.select(
    publicEventTokenSelector
  );
  private publicEventLocations$: Observable<LocationTokenDTO[]> =
    this.store.select(publicEventLocationsSelector);
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
        this.store.dispatch(
          retrieveEventLocationsTokens({ profileDTO: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const publicEventLocationsSub = this.publicEventLocations$.subscribe(
      publicEventLocations => {
        if (publicEventLocations) {
          this.locationsTokens = [...publicEventLocations];
        }
      }
    );

    this.subscriptions.add(publicEventLocationsSub);

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

  public displayLocationDates(publcEventLocation: LocationTokenDTO): void {
    this.store.dispatch(
      setDatesDisplay({ datesDisplay: DatesDisplay.location_dates })
    );

    const eventComponent: EventComponentDTO = {
      component: EventComponents.event_location,
      componentId: publcEventLocation.locationId,
    };
    this.store.dispatch(setEventComponent({ eventComponent }));

    this.router.navigate([`../${PublicEventRoutes.DATES}`], {
      relativeTo: this.activatedRoute,
    });
  }
}
