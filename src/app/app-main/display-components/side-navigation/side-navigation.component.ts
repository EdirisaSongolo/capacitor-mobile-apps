import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth-core/auth-service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UserProfileConstants } from '@app-core/user-profile-core/data-models';
import { userProfileInfoSelector } from '@app-store/app.selectors';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  AppTheme,
  Device,
  ThemePreference,
} from '@domain-data-models/app-domain.enums';
import {
  BreakPointService,
  SideNavService,
  ThemeService,
} from '@domain-services/index';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { LogOutService } from '@app-main/services/log-out/log-out.service';

interface SideNavLinks {
  name: string;
  route: string;
}

@Component({
  selector: 'Tsk-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SideNavigationComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public authenticated: boolean = false;
  public darkTheme: boolean = false;
  public themeLabel: string = 'side-nav-links.light';

  public userProfileImage: string = `url(${UserProfileConstants.DEFAULT_PROFILE_IMAGE}) center center / contain no-repeat`;
  public userProfileInfo: UserProfileInfo;

  public navigationLinks: SideNavLinks[] = [
    {
      name: 'side-nav-links.payment-methods',
      route: '/dash-board/user-profile/payment-methods',
    },
    {
      name: 'side-nav-links.profile-management',
      route: '/dash-board/profile-management',
    },
    {
      name: 'side-nav-links.password',
      route: '/dash-board/user-profile/password',
    },
  ];

  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private sideNav: SideNavService,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private themeService: ThemeService,
    private logOutService: LogOutService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const authenticated = this.authService.userAuthenicated$.subscribe(
      (authenticated: boolean) => {
        this.authenticated = authenticated;
      }
    );

    this.subscriptions.add(authenticated);

    const userProfileInfoSub = this.userProfileInfo$.subscribe(
      userProfileInfo => {
        if (userProfileInfo) {
          this.userProfileInfo = { ...userProfileInfo };
          this.processUserProfileImage();
        }
      }
    );

    this.subscriptions.add(userProfileInfoSub);

    const themeSub = this.themeService.themeObservable.subscribe(theme => {
      this.darkTheme = theme === AppTheme.dark;

      let themeLabel: string = 'side-nav-links.light';
      if (this.darkTheme) themeLabel = 'side-nav-links.dark';
      this.themeLabel = themeLabel;
    });

    this.subscriptions.add(themeSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public updateIsOpen(): void {
    this.sideNav.updateIsOpen();
  }

  public toggleDarkTheme(toggle: MatSlideToggleChange): void {
    let themePreference: ThemePreference = ThemePreference.light;
    if (toggle.checked) themePreference = ThemePreference.dark;

    this.themeService.saveUserTheme(themePreference);
  }

  public displayLogIn(): void {
    this.sideNav.updateIsOpen();
    this.router.navigate(['/auth']);
  }

  public userLogOut(): void {
    if (this.authenticated) {
      this.logOutService.logOutUser();
      this.router.navigate(['/public-events']);
    }
  }

  private processUserProfileImage(): void {
    const imagePath =
      this.userProfileInfo.profileImage ??
      UserProfileConstants.DEFAULT_PROFILE_IMAGE;
    this.userProfileImage = `url(${imagePath}) center center / contain no-repeat`;
  }
}
