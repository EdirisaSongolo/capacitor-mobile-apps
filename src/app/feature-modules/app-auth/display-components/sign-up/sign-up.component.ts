import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { registerUserProfile } from '@auth-core/store';
import {
  AppResponse,
  AppResponseType,
  Device,
} from '@app-core/app-domain/domain-data-models';
import { BreakPointService } from '@app-core/app-domain/domain-services';
import { SignUp } from '@app-core/auth-core/api/auth.dto-models';
import { TranslateService } from '@ngx-translate/core';
import { createAppResponse } from '@core-modules';

@Component({
  selector: 'Tsk-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SignUpComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public appResponse: AppResponse | null = null;
  public responseTypes: typeof AppResponseType = AppResponseType;

  public signUpForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    userName: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    userPassword: ['', [Validators.required]],
    confirmPassword: ['', Validators.required],
  });

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
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

  public createUserProfile(): void {
    let invalidForm: boolean = false;
    const formValues = this.signUpForm.value;
    const appResponse: AppResponse = {
      viewed: false,
      type: AppResponseType.warning,
      messages: [],
    };

    if (this.signUpForm.invalid) {
      appResponse.messages.push(
        this.translator.instant('common-errors.required-fields')
      );
      invalidForm = true;
    }

    if (formValues.userPassword !== formValues.confirmPassword) {
      appResponse.messages.push(
        this.translator.instant('auth.sign-up.form-errors.password-error')
      );
      invalidForm = true;
    }

    if (invalidForm) {
      this.store.dispatch(createAppResponse({ appResponse: appResponse }));
      return;
    }

    const signUp: SignUp = {
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      userName: formValues.userName.trim(),
      emailAddress: formValues.emailAddress.trim(),
      userPassword: formValues.userPassword.trim(),
    };

    this.store.dispatch(registerUserProfile({ signUp: signUp }));
  }
}
