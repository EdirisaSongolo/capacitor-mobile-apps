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
import { BreakPointService } from '@domain-services/index';

import { VendorTokenDTO } from '@app-core/vendors-core/api';
import {
  DashboardDisplay,
  DashboardDisplayPanel,
  DetailsDisplay,
  VendorsDashboardRoutes,
} from '@vendors-core/data-models';
import {
  setVendorsDetailsDisplay,
  vendorTokenSelector,
} from '@app-core/vendors-core/store';
import { setComponentAction, setProfileDTO } from '@app-domain/store';
import { RevenueAccountService } from '@profile-revenue-core/services/revenue-account.service';

@Component({
  selector: 'Tsk-vendor-profile-dashboard',
  templateUrl: './vendor-profile-dashboard.component.html',
  styleUrls: ['./vendor-profile-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VendorProfileDashboardComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public vendorControls: DashboardDisplay[] = [
    {
      display: DashboardDisplayPanel.details,
      name: 'vendors-dashboard.navigation.profile.details',
      icon: 'page_info',
      route: VendorsDashboardRoutes.DETAILS,
    },
    {
      display: DashboardDisplayPanel.media,
      name: 'vendors-dashboard.navigation.profile.media',
      icon: 'dashboard_2',
      route: VendorsDashboardRoutes.MEDIA,
    },
    {
      display: DashboardDisplayPanel.business_profile,
      name: 'vendors-dashboard.navigation.profile.account',
      icon: 'shape_line',
      route: VendorsDashboardRoutes.BUSINESS_PROFILE,
    },
    {
      display: DashboardDisplayPanel.revenue_account,
      name: 'vendors-dashboard.navigation.profile.account',
      icon: 'vertical_distribute',
      route: VendorsDashboardRoutes.REVENUE_ACCOUNT,
    },
  ];

  public vendorToken: VendorTokenDTO;

  private vendorToken$: Observable<VendorTokenDTO> =
    this.store.select(vendorTokenSelector);
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

    const vendorProfileIdSub = this.activatedRoute.paramMap.subscribe(
      params => {
        const vendorProfileId = params.get('vendorProfileId');
        if (vendorProfileId) {
          const profileDTO = {
            profile: Profiles.vendorProfile,
            profileId: vendorProfileId,
          };

          this.store.dispatch(setProfileDTO({ profileDTO: profileDTO }));
          this.store.dispatch(
            setComponentAction({ componentAction: ComponentAction.dashboard })
          );

          this.store.dispatch(
            setVendorsDetailsDisplay({
              detailsDisplay: DetailsDisplay.UPDATE_DETAILS,
            })
          );
        }
      }
    );

    this.subscriptions.add(vendorProfileIdSub);

    const vendorTokenSub = this.vendorToken$.subscribe(vendorToken => {
      if (vendorToken) {
        this.vendorToken = { ...vendorToken };
      }
    });

    this.subscriptions.add(vendorTokenSub);
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
