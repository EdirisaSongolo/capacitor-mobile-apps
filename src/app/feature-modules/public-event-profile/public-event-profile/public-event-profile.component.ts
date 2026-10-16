import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { EventComponentDTO } from '@public-events-core/api';
import {
  ProfileDisplayPanel,
  ProfileDisplayControl,
  PublicEventConstants,
  PublicEventRoutes,
  DatesDisplay,
} from '@public-events-core/data-models';
import { ProfileDTO } from '@app-core/app-api';
import { setComponentAction, setProfileDTO } from '@app-domain/store';
import { setDatesDisplay } from '@public-events-core/store';

@Component({
  selector: 'Tsk-public-event-profile',
  templateUrl: './public-event-profile.component.html',
  styleUrls: ['./public-event-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventProfileComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: typeof ComponentAction = ComponentAction;
  public displayPanel: ProfileDisplayPanel = ProfileDisplayPanel.media;
  public panelOptions: typeof ProfileDisplayPanel = ProfileDisplayPanel;
  public profileImage: string = `${PublicEventConstants.DEFAULT_PROFILE_IMAGE} center / contain no-repeat`;

  public profileDTO: ProfileDTO;
  public eventComponent: EventComponentDTO;

  public displayControls: ProfileDisplayControl[] = [
    {
      display: ProfileDisplayPanel.media,
      name: 'public-event-profile.display-controls.media',
      icon: 'dashboard_2',
      route: PublicEventRoutes.MEDIA,
    },
    {
      display: ProfileDisplayPanel.dates,
      name: 'public-event-profile.display-controls.dates',
      icon: 'density_medium',
      route: PublicEventRoutes.DATES,
    },
    {
      display: ProfileDisplayPanel.features,
      name: 'public-event-profile.display-controls.features',
      icon: 'event_list',
      route: PublicEventRoutes.FEATURES,
    },
    {
      display: ProfileDisplayPanel.locations,
      name: 'public-event-profile.display-controls.locations',
      icon: 'unknown_med',
      route: PublicEventRoutes.LOCATIONS,
    },
  ];

  public locationId: string;

  private publicEventId: string;
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const routerParamSub = this.activatedRoute.paramMap.subscribe(
      parameters => {
        this.publicEventId = parameters.get('publicEventId');
        this.profileDTO = {
          profile: Profiles.publicEventProfile,
          profileId: this.publicEventId,
        };

        this.store.dispatch(setProfileDTO({ profileDTO: this.profileDTO }));
        this.store.dispatch(
          setComponentAction({ componentAction: ComponentAction.profile })
        );
      }
    );

    this.subscriptions.add(routerParamSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public updateDisplayPanel(route: PublicEventRoutes): void {
    if (route === PublicEventRoutes.DATES) {
      this.store.dispatch(
        setDatesDisplay({ datesDisplay: DatesDisplay.event_dates })
      );
    }

    this.router.navigate([route], { relativeTo: this.activatedRoute });
  }

  // public displayPublicEventLocation(
  //   publicEventLocation: LocationTokenDTO
  // ): void {
  //   this.locationId = publicEventLocation.locationId;
  //   this.displayPanel = ProfileDisplayPanel.dates;
  // }

  // public displayPublicEventDate(publicEventDate: DateTokenDTO): void {
  //   this.eventComponent = {
  //     component: EventComponents.event_date,
  //     componentId: publicEventDate.dateId,
  //   };
  //   this.displayPanel = this.panelOptions.dateDetails;
  // }
}
