import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';

import {
  DashboardDisplay,
  DashboardDisplayPanel,
  UserProfileDashboardRoutes,
} from '@user-profile-core/data-models';

import { userProfileInfoSelector } from '@core-modules';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { setComponentAction, setProfileDTO } from '@app-domain/store';
import { RevenueAccountService } from '@profile-revenue-core/services/revenue-account.service';

@Component({
  selector: 'Tsk-user-profile-dashboard',
  templateUrl: './user-profile-dashboard.component.html',
  styleUrls: ['./user-profile-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserProfileDashboardComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public userProfileControls: DashboardDisplay[] = [
    {
      display: DashboardDisplayPanel.details,
      icon: 'page_info',
      route: UserProfileDashboardRoutes.DETAILS,
    },
    {
      display: DashboardDisplayPanel.interests,
      icon: 'indeterminate_check_box',
      route: UserProfileDashboardRoutes.INTERESTS,
    },
    {
      display: DashboardDisplayPanel.business_profile,
      icon: 'shape_line',
      route: UserProfileDashboardRoutes.BUSINESS_PROFILE,
    },
    {
      display: DashboardDisplayPanel.revenue_account,
      icon: 'vertical_distribute',
      route: UserProfileDashboardRoutes.REVENUE_ACCOUNT,
    },
  ];

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
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

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        if (userProfileInfo.userProfileId) {
          const profileDTO = {
            profile: Profiles.userProfile,
            profileId: userProfileInfo.userProfileId,
          };

          this.store.dispatch(setProfileDTO({ profileDTO: profileDTO }));

          this.store.dispatch(
            setComponentAction({ componentAction: ComponentAction.dashboard })
          );
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);
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
