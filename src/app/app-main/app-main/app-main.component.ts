import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Device } from '@domain-data-models/app-domain.enums';
import {
  BreakPointService,
  ThemeService,
} from '@app-core/app-domain/domain-services';
import { Store } from '@ngrx/store';
import { AuthService } from '@auth-core/auth-service';
import {
  retrieveUserProfileInfo,
  userProfileLoadedSelector,
} from '@core-modules';
import { WebSocketService } from '@app-core/app-api/web-socket/web-socket.service';
import { NotificationsConfigService } from '@communications-core/firebase';
import { ApiCallIndicatorService } from '@app-core/app-api';

@Component({
  selector: 'Tsk-app-main',
  templateUrl: './app-main.component.html',
  styleUrls: ['./app-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppMainComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public apiCallInProgress$: Observable<boolean> =
    this.apiCallIndicator.apiCallInProgress$;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private profileLoaded$: Observable<boolean> = this.store.select(
    userProfileLoadedSelector
  );
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private notificationConfigService: NotificationsConfigService,
    private authService: AuthService,
    private websocketService: WebSocketService,
    private apiCallIndicator: ApiCallIndicatorService,
    private themeService: ThemeService
  ) {}

  public ngOnInit(): void {
    window.onscroll = () => {
      this.fixHeaderPosition();
    };

    const breakpointSubscription = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSubscription);

    this.authService.checkUserAuthentication();

    const authenticationSub = this.authService.userAuthenicated$.subscribe(
      (authenticated: boolean) => {
        if (authenticated) {
          this.themeService.applyStoredTheme();
          this.store.dispatch(retrieveUserProfileInfo());
          this.notificationConfigService.establishHandshake();
          this.notificationConfigService.listenForNotifications();
        } else {
          this.notificationConfigService.stopListening();
          this.themeService.applySystemTheme();
        }
      }
    );

    this.subscriptions.add(authenticationSub);

    const profileLoadedSub = this.profileLoaded$.subscribe(profileLoaded => {
      if (profileLoaded) {
        this.websocketService.connect();
      } else {
        this.websocketService.disconnect();
      }
    });

    this.subscriptions.add(profileLoadedSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private fixHeaderPosition(): void {
    const header = document.getElementById('navigation') as HTMLElement;
    const top = header.offsetTop;

    if (window.scrollY > top) {
      header.classList.add('fixed-header');
    } else {
      header.classList.remove('fixed-header');
    }
  }
}
