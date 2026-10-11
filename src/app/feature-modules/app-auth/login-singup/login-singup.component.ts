import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@app-core/app-domain/domain-services';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@auth-core/auth-service';

const LOG_IN: string = 'log-in';
const SIGN_UP: string = 'sign-up';
const RECOVER_CREDENTIALS: string = 'recover-credentials';

@Component({
  selector: 'Tsk-login-singup',
  templateUrl: './login-singup.component.html',
  styleUrls: ['./login-singup.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LoginSingupComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public viewOption: string = 'button-label.sign-up';
  public display: string = LOG_IN;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const authenticated = this.authService.userAuthenicated$.subscribe(
      (authenticated: boolean) => {
        if (authenticated) {
          const returnUrl: string =
            this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
          this.router.navigateByUrl(returnUrl ?? '/public-events');
        }
      }
    );

    this.subscriptions.add(authenticated);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayFormComponent(formComponent?: string): void {
    if (formComponent !== undefined) {
      this.viewOption = 'button-label.log-in';
      this.display = RECOVER_CREDENTIALS;
      return;
    }

    if (this.display === SIGN_UP || this.display === RECOVER_CREDENTIALS) {
      this.viewOption = 'button-label.sign-up';
      this.display = LOG_IN;
    } else if (this.display === LOG_IN) {
      this.viewOption = 'button-label.log-in';
      this.display = SIGN_UP;
    }
  }
}
