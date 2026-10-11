import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

import {
  AppResponseType,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';

import {
  IdentityVerificationDTO,
  RevenueAccountDTO,
} from '@profile-revenue-core/api';
import { verifyRepresentativeIdentification } from '@profile-revenue-core/store';

@Component({
  selector: 'Tsk-identity-verification',
  templateUrl: './identity-verification.component.html',
  styleUrls: ['./identity-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class IdentityVerificationComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() public revenueAccount: RevenueAccountDTO;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileDTO: ProfileDTO;
  public profileOptions: typeof Profiles = Profiles;

  public verificationForm = this.formBuilder.group({
    verification_number: ['', Validators.required],
  });

  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
      }
    });

    this.subscriptions.add(profileDTOSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const revenueAccountChanges = changes['revenueAccount'];
    if (revenueAccountChanges?.currentValue) {
      const revenueAccount = revenueAccountChanges.currentValue;
      this.processRevenueAccount(revenueAccount);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submitVerificationForm(): void {
    const isTheSameObject: boolean = false;

    if (isTheSameObject) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'common-errors.no-changes-detected',
      ]);
      return;
    }

    const verificationForm = this.verificationForm.value;

    const identityVerificationDTO: IdentityVerificationDTO = {
      verificationNumber: verificationForm.verification_number,
    };

    this.store.dispatch(
      verifyRepresentativeIdentification({
        revenueAccountId: this.revenueAccount.revenueAccountId,
        identityVerificationDTO: identityVerificationDTO,
      })
    );
  }

  private processRevenueAccount(revenueAccount: RevenueAccountDTO): void {
    const identityVerification: IdentityVerificationDTO =
      revenueAccount.identityVerification;
    if (identityVerification) {
      this.verificationForm.patchValue({
        verification_number: identityVerification.verificationNumber,
      });
    }
  }
}
