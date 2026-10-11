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
import {
  setComponentAction,
  setProfileDTO,
} from '@app-domain/store/domain.actions';
import { BreakPointService } from '@domain-services/index';
import {
  DashboardDisplay,
  DashboardDisplayPanel,
  EventStaffDisplay,
  LocationsDisplay,
  PublicEventAction,
  PublicEventCategories,
  PublicEventDashboardRoutes,
} from '@public-events-core/data-models';

import { ProfileDTO } from '@app-core/app-api';
import {
  eventNameSelector,
  resetCreatePublicEventValues,
  setEventId,
  setEventStaffDisplay,
  setLocationsDisplay,
  setPublicEventAction,
  setPublicEventCategory,
  setPublicEventDescription,
  setPublicEventName,
  setPublicEventProfileImage,
} from '@app-core/public-events-core/store/create-edit-event';
import {
  publicEventTokenSelector,
  retrievePublicEventToken,
} from '@public-events-core/store';
import { PublicEventTokenDTO } from '@public-events-core/api';

@Component({
  selector: 'Tsk-public-event-profile-dashboard',
  templateUrl: './public-event-profile-dashboard.component.html',
  styleUrls: ['./public-event-profile-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventProfileDashboardComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public eventCreationAction: PublicEventAction = PublicEventAction.edit_event;
  public componentAction: typeof ComponentAction = ComponentAction;
  public profile: ProfileDTO;

  public displayPanel: DashboardDisplayPanel = DashboardDisplayPanel.details;
  public panelOptions: typeof DashboardDisplayPanel = DashboardDisplayPanel;

  public cropIcon: string = 'crop_free';
  public publicEventControls: DashboardDisplay[] = [
    {
      display: DashboardDisplayPanel.details,
      route: PublicEventDashboardRoutes.DETAILS,
      icon: 'page_info',
    },
    {
      display: DashboardDisplayPanel.media,
      route: PublicEventDashboardRoutes.MEDIA,
      icon: 'dashboard_2',
    },
    {
      display: DashboardDisplayPanel.locations,
      route: PublicEventDashboardRoutes.LOCATIONS,
      icon: 'crop_portrait',
    },
    {
      display: DashboardDisplayPanel.staff,
      route: PublicEventDashboardRoutes.STAFF,
      icon: 'hdr_weak',
    },
    {
      display: DashboardDisplayPanel.account,
      route: PublicEventDashboardRoutes.PRINCIPAL,
      icon: 'server_person',
    },
    {
      display: DashboardDisplayPanel.cancel,
      route: PublicEventDashboardRoutes.CANCEL,
      icon: 'delete',
    },
  ];

  private publicEventId: string;

  public publicEventName$: Observable<string> =
    this.store.select(eventNameSelector);
  private publicEventTokenDTO$: Observable<PublicEventTokenDTO> =
    this.store.select(publicEventTokenSelector);
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

    const routerParamSub = this.activatedRoute.paramMap.subscribe(
      parameters => {
        this.store.dispatch(resetCreatePublicEventValues());

        this.publicEventId = parameters.get('publicEventId');
        this.profile = {
          profile: Profiles.publicEventProfile,
          profileId: this.publicEventId,
        };

        this.store.dispatch(setProfileDTO({ profileDTO: this.profile }));

        this.store.dispatch(
          setComponentAction({ componentAction: ComponentAction.dashboard })
        );

        this.store.dispatch(
          setPublicEventAction({
            publicEventAction: PublicEventAction.edit_event,
          })
        );

        this.store.dispatch(
          retrievePublicEventToken({ profileDTO: this.profile })
        );
      }
    );

    this.subscriptions.add(routerParamSub);

    const publicEventTokenSub = this.publicEventTokenDTO$.subscribe(
      publicEventToken => {
        if (publicEventToken) {
          this.processPublicEventToken(publicEventToken);
        }
      }
    );

    this.subscriptions.add(publicEventTokenSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.store.dispatch(resetCreatePublicEventValues());
  }

  public updateDisplayPanel(route: string): void {
    this.router.navigate([route], { relativeTo: this.activatedRoute });
    if (route === PublicEventDashboardRoutes.LOCATIONS) {
      this.store.dispatch(
        setLocationsDisplay({
          locationsDisplay: LocationsDisplay.create_edit_location,
        })
      );
    }

    if (route === PublicEventDashboardRoutes.STAFF) {
      this.store.dispatch(
        setEventStaffDisplay({
          staffDisplay: EventStaffDisplay.event_locations,
        })
      );
    }
  }

  private processPublicEventToken(
    publicEventTokenDTO: PublicEventTokenDTO
  ): void {
    this.store.dispatch(setEventId({ eventId: publicEventTokenDTO.eventId }));

    if (publicEventTokenDTO?.profileImage) {
      const imagePath = publicEventTokenDTO?.profileImage;
      this.store.dispatch(
        setPublicEventProfileImage({ profileImage: imagePath })
      );
    }

    Object.entries(PublicEventCategories).forEach(([key, value]) => {
      if (value === publicEventTokenDTO.eventCategory) {
        const publicEventCategory: string = key;

        this.store.dispatch(
          setPublicEventCategory({ eventCategory: publicEventCategory })
        );
      }
    });

    this.store.dispatch(
      setPublicEventName({ eventName: publicEventTokenDTO.eventName })
    );

    this.store.dispatch(
      setPublicEventDescription({
        eventDescription: publicEventTokenDTO.eventDescription,
      })
    );
  }
}
