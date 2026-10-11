import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  DashboardDisplay,
  DashboardDisplayPanel,
  PrivateEventAction,
  PrivateEventsRoutes,
} from '@app-core/private-events-core/data-models';

import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ProfileDTO } from '@app-core/app-api';
import {
  privateEventNameSelector,
  resetCreatePrivateEventValues,
  setPrivateEventAction,
  setPrivateEventDate,
  setPrivateEventHost,
  setPrivateEventInvitation,
  setPrivateEventName,
  setPrivateEventProfileImage,
  setPrivateEventTime,
} from '@app-core/private-events-core/store/create-edit-event';
import { setComponentAction, setProfileDTO } from '@app-domain/store';
import { PrivateEventTokenDTO } from '@private-events-core/api';
import {
  privateEventTokenSelector,
  retrievePrivateEventToken,
} from '@private-events-core/store';

@Component({
  selector: 'Tsk-private-event-profile-dashboard',
  templateUrl: './private-event-profile-dashboard.component.html',
  styleUrls: ['./private-event-profile-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivateEventProfileDashboardComponent
  implements OnInit, OnDestroy
{
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayPanel: DashboardDisplayPanel = DashboardDisplayPanel.details;
  public panelOptions: typeof DashboardDisplayPanel = DashboardDisplayPanel;
  public componentAction: typeof ComponentAction = ComponentAction;

  public cropIcon: string = 'crop_free';
  public privateEventControls: DashboardDisplay[] = [
    {
      display: DashboardDisplayPanel.details,
      route: PrivateEventsRoutes.DETAILS,
      icon: 'page_info',
    },
    {
      display: DashboardDisplayPanel.media,
      route: PrivateEventsRoutes.MEDIA,
      icon: 'dashboard_2',
    },
    {
      display: DashboardDisplayPanel.location,
      route: PrivateEventsRoutes.LOCATION,
      icon: 'crop_portrait',
    },
    {
      display: DashboardDisplayPanel.staff,
      route: PrivateEventsRoutes.STAFF,
      icon: 'hdr_weak',
    },
    {
      display: DashboardDisplayPanel.guests,
      route: PrivateEventsRoutes.GUESTS,
      icon: 'stacks',
    },
    {
      display: DashboardDisplayPanel.cancel,
      route: PrivateEventsRoutes.CANCEL,
      icon: 'delete',
    },
  ];

  public privateEventName: string;
  public profileDTO: ProfileDTO;
  private privateEventId: string;

  public privateEventName$: Observable<string> = this.store.select(
    privateEventNameSelector
  );
  private privateEventTokenDTO$: Observable<PrivateEventTokenDTO> =
    this.store.select(privateEventTokenSelector);
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

    const privateEventIdSub = this.activatedRoute.paramMap.subscribe(params => {
      this.store.dispatch(resetCreatePrivateEventValues());

      this.privateEventId = params.get('privateEventId');
      this.profileDTO = {
        profile: Profiles.privateEventProfile,
        profileId: this.privateEventId,
      };

      this.store.dispatch(setProfileDTO({ profileDTO: this.profileDTO }));

      this.store.dispatch(
        setComponentAction({ componentAction: ComponentAction.dashboard })
      );

      this.store.dispatch(
        setPrivateEventAction({
          privateEventAction: PrivateEventAction.edit_event,
        })
      );

      this.store.dispatch(
        retrievePrivateEventToken({ profileDTO: this.profileDTO })
      );
    });

    this.subscriptions.add(privateEventIdSub);

    const privateEventTokenSub = this.privateEventTokenDTO$.subscribe(
      privateEventToken => {
        if (privateEventToken) {
          this.processPrivateEventToken(privateEventToken);
        }
      }
    );

    this.subscriptions.add(privateEventTokenSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.store.dispatch(resetCreatePrivateEventValues());
  }

  public updateDisplayPanel(route: string): void {
    this.router.navigate([route], { relativeTo: this.activatedRoute });
  }

  private processPrivateEventToken(privateEventToken: PrivateEventTokenDTO) {
    if (privateEventToken.profileImage) {
      this.store.dispatch(
        setPrivateEventProfileImage({
          profileImage: privateEventToken.profileImage,
        })
      );
    }

    this.store.dispatch(
      setPrivateEventName({ eventName: privateEventToken.eventName })
    );

    this.store.dispatch(
      setPrivateEventTime({
        startTime: privateEventToken.startTime,
        endTime: privateEventToken.endTime,
      })
    );

    this.store.dispatch(
      setPrivateEventDate({ eventDate: privateEventToken.eventDate })
    );

    this.store.dispatch(
      setPrivateEventHost({ eventHost: privateEventToken.eventHost })
    );

    this.store.dispatch(
      setPrivateEventInvitation({
        eventInvitation: privateEventToken.eventInvitation,
      })
    );
  }
}
