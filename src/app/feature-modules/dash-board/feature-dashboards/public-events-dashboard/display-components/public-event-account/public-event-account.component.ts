import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import {
  eventPrincipalSelector,
  retrieveEventPrincipalProfile,
} from '@public-events-core/store';
import { PublicEventPrincipalDTO } from '@public-events-core/api';
import { VendorTokenDTO } from '@vendors-core/api';
import { PublicEventDashboardRoutes } from '@public-events-core/data-models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'Tsk-public-event-account',
  templateUrl: './public-event-account.component.html',
  styleUrls: ['./public-event-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventAccountComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.dashboard;
  public vendorToken: VendorTokenDTO;

  public accountControls: any[] = [
    {
      icon: 'account_balance_wallet',
      title: 'public-event-dashboard.event-account.selection-options.ticket-sales-title',
      description:
        'public-event-dashboard.event-account.selection-options.ticket-sales-description',
      route: PublicEventDashboardRoutes.TICKET_SALES,
    },
    {
      icon: 'exit_to_app',
      title: 'public-event-dashboard.event-account.selection-options.gate-personnel-title',
      description:
        'public-event-dashboard.event-account.selection-options.gate-personnel-description',
      route: PublicEventDashboardRoutes.GATE_PERSONALE,
    },
  ];

  private profileDTO: ProfileDTO;
  private principalProfile: PublicEventPrincipalDTO;

  private principalProfile$: Observable<PublicEventPrincipalDTO> =
    this.store.select(eventPrincipalSelector);
  private profileDTo$: Observable<ProfileDTO> =
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

    const profileDTOSub = this.profileDTo$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.store.dispatch(
          retrieveEventPrincipalProfile({ profileDTO: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const principalProfileSub = this.principalProfile$.subscribe(
      principalProfile => {
        if (principalProfile) {
          this.principalProfile = principalProfile;
          this.processPublicEventPrincipalProfile(this.principalProfile);
        }
      }
    );

    this.subscriptions.add(principalProfileSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public navigateToRoute(route: PublicEventDashboardRoutes): void {
    this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
  }

  private processPublicEventPrincipalProfile(
    principalProfile: PublicEventPrincipalDTO
  ): void {
    this.vendorToken = principalProfile.principalProfile;
  }
}
