import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordResetDTO } from '@app-core/auth-core/api';
import {
  createUserTemporaryPassword,
  resetUserPassword,
} from '@app-core/auth-core/store';
import { createAppResponse } from '@core-modules';
import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import { AppResponse } from '@domain-data-models/app-domain.interfaces';
import { BreakPointService } from '@domain-services/index';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'Tsk-credentials-recovery',
  templateUrl: './credentials-recovery.component.html',
  styleUrls: ['./credentials-recovery.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CredentialsRecoveryComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public appResponse: AppResponse | null = null;
  public responseTypes: typeof AppResponseType = AppResponseType;

  public userEmailForm: FormGroup = this.formBuilder.group({
    userEmail: ['', [Validators.required, Validators.email]],
  });

  public temporaryPasswordCreated: boolean = false;
  public userPasswordForm: FormGroup = this.formBuilder.group({
    temporaryPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store,
    private breakPoint: BreakPointService,
    private formBuilder: FormBuilder,
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

  public createTemporaryPassword(): void {
    if (this.userEmailForm.invalid) {
      const appResponse: AppResponse = {
        viewed: false,
        type: AppResponseType.warning,
        messages: [
          this.translator.instant(
            'auth.credentials-recovery.form-errors.missing-fields'
          ),
        ],
      };

      this.store.dispatch(createAppResponse({ appResponse: appResponse }));
      return;
    }

    const emailDTO = this.userEmailForm.value;
    this.store.dispatch(createUserTemporaryPassword({ userEmail: emailDTO }));
    this.temporaryPasswordCreated = true;
  }

  public resetUserPassword(): void {
    let invalidForm: boolean = false;
    const formValues = this.userPasswordForm.value;
    const appResponse: AppResponse = {
      viewed: false,
      type: AppResponseType.warning,
      messages: [],
    };

    if (this.userPasswordForm.invalid) {
      appResponse.messages.push(
        this.translator.instant(
          'auth.credentials-recovery.form-errors.missing-fields'
        )
      );
      invalidForm = true;
    }

    if (formValues.newPassword !== formValues.confirmPassword) {
      appResponse.messages.push(
        this.translator.instant(
          'auth.credentials-recovery.form-errors.mismatched-passwords'
        )
      );
      invalidForm = true;
    }

    if (invalidForm) {
      this.store.dispatch(createAppResponse({ appResponse: appResponse }));
      return;
    }

    const passwordReset: PasswordResetDTO = {
      temporaryPassword: formValues.temporaryPassword,
      userPassword: formValues.newPassword,
    };
    this.store.dispatch(resetUserPassword({ passwordReset: passwordReset }));
  }
}
