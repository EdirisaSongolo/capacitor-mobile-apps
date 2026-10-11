import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import {
  AccountDisplay,
  AccountDisplayPanel,
  SocialsDisplay,
} from '@user-profile-core/data-models';
import { ProfileDTO } from '@app-core/app-api';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { Store } from '@ngrx/store';
import { userProfileInfoSelector } from '@core-modules';
import { updateSocialsDisplay } from '@user-profile-core/store';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAccountRoutes } from '@user-profile-core/data-models/user-account.routes';
import { setComponentAction, setProfileDTO } from '@app-domain/store';

@Component({
  selector: 'Tsk-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserAccountComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayPanel: AccountDisplayPanel = AccountDisplayPanel.media;
  public panelOptions: typeof AccountDisplayPanel = AccountDisplayPanel;

  public displayControls: AccountDisplay[] = [
    {
      display: AccountDisplayPanel.user_events,
      name: 'user-profile.profile-displays.public-events',
      icon: 'align_justify_space_even',
      route: UserAccountRoutes.USER_EVENTS,
    },
    {
      display: AccountDisplayPanel.media,
      name: 'user-profile.profile-displays.media',
      icon: 'dashboard_2',
      route: UserAccountRoutes.MEDIA,
    },
    {
      display: AccountDisplayPanel.profile_booking,
      name: 'user-profile.profile-displays.notifications',
      icon: 'grid_view_outlined',
      route: UserAccountRoutes.BOOKING,
    },
    {
      display: AccountDisplayPanel.user_actions,
      name: 'user-profile.profile-displays.actions',
      icon: 'page_menu_ios',
      route: UserAccountRoutes.ACTIONS,
    },
  ];

  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );

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

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        if (userProfileInfo?.userProfileId) {
          const profileDTO: ProfileDTO = {
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

  public processHeaderAction(socialsOption: SocialsDisplay): void {
    this.router.navigate([`${UserAccountRoutes.SOCIALS}`], {
      relativeTo: this.activatedRoute,
    });
    this.store.dispatch(
      updateSocialsDisplay({ socialsDisplay: socialsOption })
    );
  }

  public updateDisplayPanel(accountDisplay: AccountDisplay): void {
    this.router.navigate([`${accountDisplay.route}`], {
      relativeTo: this.activatedRoute,
    });
    this.displayPanel = accountDisplay.display;
  }
}
