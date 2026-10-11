import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';

import { VenueTokenDTO } from '@venues-core/api';
import {
  setVenuesDetailsDisplay,
  venueTokenSelector,
} from '@venues-core/store';

import {
  DashboardDisplay,
  DashboardDisplayPanel,
  DetailsDisplay,
  VenuesDashboardRoutes,
} from '@venues-core/data-models';
import { ProfileDTO } from '@app-core/app-api';
import { setComponentAction, setProfileDTO } from '@app-domain/store';
import { RevenueAccountService } from '@profile-revenue-core/services/revenue-account.service';

@Component({
  selector: 'Tsk-venue-profile-dashboard',
  templateUrl: './venue-profile-dashboard.component.html',
  styleUrls: ['./venue-profile-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VenueProfileDashboardComponent implements OnInit {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public venueControls: DashboardDisplay[] = [
    {
      display: DashboardDisplayPanel.details,
      name: 'venues-dashboard.navigation.profile.details',
      icon: 'page_info',
      route: VenuesDashboardRoutes.DETAILS,
    },
    {
      display: DashboardDisplayPanel.media,
      name: 'venues-dashboard.navigation.profile.media',
      icon: 'dashboard_2',
      route: VenuesDashboardRoutes.MEDIA,
    },
    {
      display: DashboardDisplayPanel.business_profile,
      name: 'venues-dashboard.navigation.profile.account',
      icon: 'shape_line',
      route: VenuesDashboardRoutes.BUSINESS_PROFILE,
    },
    {
      display: DashboardDisplayPanel.revenue_account,
      name: 'vendors-dashboard.navigation.profile.account',
      icon: 'vertical_distribute',
      route: VenuesDashboardRoutes.REVENUE_ACCOUNT,
    },
  ];

  public venueToken: VenueTokenDTO;

  private venueToken$: Observable<VenueTokenDTO> =
    this.store.select(venueTokenSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: RevenueAccountService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const venueProfileIdSub = this.activatedRoute.paramMap.subscribe(
      parameters => {
        const venueProfileId = parameters.get('venueProfileId');
        const profileDTO: ProfileDTO = {
          profile: Profiles.venueProfile,
          profileId: venueProfileId,
        };

        this.store.dispatch(setProfileDTO({ profileDTO: profileDTO }));
        this.store.dispatch(
          setComponentAction({ componentAction: ComponentAction.dashboard })
        );

        this.store.dispatch(
          setVenuesDetailsDisplay({
            detailsDisplay: DetailsDisplay.UPDATE_DETAILS,
          })
        );
      }
    );

    this.subscriptions.add(venueProfileIdSub);

    const venueTokenSub = this.venueToken$.subscribe(venueToken => {
      if (venueToken) {
        this.venueToken = { ...venueToken };
      }
    });
    this.subscriptions.add(venueTokenSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public updateDisplayPanel(dashboardDisplay: DashboardDisplay): void {
    this.router.navigate([dashboardDisplay.route], {
      relativeTo: this.activatedRoute,
    });

    if (dashboardDisplay.display === DashboardDisplayPanel.revenue_account) {
      this.accountService.setAccountMain(true);
    }
  }
}
