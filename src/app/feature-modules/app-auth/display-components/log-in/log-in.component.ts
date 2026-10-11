import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { authenticateUserProfile } from '@auth-core/store';
import {
  AppResponse,
  AppResponseType,
  Device,
} from '@app-core/app-domain/domain-data-models';
import { BreakPointService } from '@app-core/app-domain/domain-services';
import { LogIn } from '@app-core/auth-core/api/auth.dto-models';
import { TranslateService } from '@ngx-translate/core';
import { createAppResponse } from '@core-modules';

@Component({
  selector: 'Tsk-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LogInComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public appResponse: AppResponse | null = null;
  public responseTypes: typeof AppResponseType = AppResponseType;

  public logInForm = this.formBuilder.group({
    userName: ['', Validators.required],
    userPassword: ['', Validators.required],
  });

  public submited: boolean = false;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private breakPoint: BreakPointService,
    private translator: TranslateService
  ) {}

  public ngOnInit(): void {
    const breakpointSubscription = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSubscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submitUserCredentials(): void {
    if (this.logInForm.invalid) {
      const appResponse: AppResponse = {
        viewed: false,
        type: AppResponseType.warning,
        messages: [
          this.translator.instant('auth.log-in.form-errors.missing-fields'),
        ],
      };

      this.store.dispatch(createAppResponse({ appResponse: appResponse }));
      return;
    }

    const formValues = this.logInForm.value;
    const logIn: LogIn = {
      userName: formValues.userName.trim() as string,
      userPassword: formValues.userPassword.trim() as string,
    };

    this.store.dispatch(authenticateUserProfile({ logIn: logIn }));
  }
}
