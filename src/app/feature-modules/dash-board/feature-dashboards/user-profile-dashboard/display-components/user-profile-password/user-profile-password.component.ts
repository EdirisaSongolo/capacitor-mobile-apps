import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BreakPointService } from '@domain-services/index';
import { Device, AppResponseType } from '@domain-data-models/app-domain.enums';
import { AppResponse } from '@domain-data-models/app-domain.interfaces';
import { createAppResponse, userProfileLoadedSelector } from '@core-modules';
import { UserPasswordDTO } from '@app-core/user-profile-core/api';
import { updateUserPassword } from '@app-core/user-profile-core/store';

@Component({
  selector: 'Tsk-user-profile-password',
  templateUrl: './user-profile-password.component.html',
  styleUrls: ['./user-profile-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserProfilePasswordComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public userPasswordForm: FormGroup = this.formBuilder.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  private authorisationSet: boolean = false;
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private profileLoaded$: Observable<boolean> = this.store.select(
    userProfileLoadedSelector
  );
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private translator: TranslateService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileLoadedSub = this.profileLoaded$.subscribe(profileLoaded => {
      if (profileLoaded) {
        this.authorisationSet = true;
      }
    });

    this.subscriptions.add(profileLoadedSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public updateUserPassword(): void {
    let invalidForm: boolean = false;
    const appResponse: AppResponse = {
      viewed: false,
      type: AppResponseType.error,
      messages: [],
    };

    if (this.userPasswordForm.invalid) {
      invalidForm = true;
      const formFieldErrors: string = this.translator.instant(
        'All form fields are required'
      );
      appResponse.messages.push(formFieldErrors);
    }

    const formFieldValues = this.userPasswordForm.value;

    if (formFieldValues.newPassword !== formFieldValues.confirmPassword) {
      invalidForm = true;
      const incorrectPassword: string = this.translator.instant(
        'Passords do not match'
      );
      appResponse.messages.push(incorrectPassword);
    }

    if (invalidForm) {
      this.store.dispatch(createAppResponse({ appResponse: appResponse }));
      return;
    }

    if (this.authorisationSet) {
      const userPasswordDTO: UserPasswordDTO = {
        currentUserPassword: formFieldValues.currentPassword,
        newUserPassword: formFieldValues.newPassword,
      };
      this.store.dispatch(
        updateUserPassword({ userPasswordDTO: userPasswordDTO })
      );
    }
  }
}
