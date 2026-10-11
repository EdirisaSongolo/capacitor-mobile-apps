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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  AppResponseType,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { DateTimeService } from '@domain-services/date-time/date-time.service';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';

import { UserTokenDTO } from '@user-profile-core/api';
import { UserProfileConstants } from '@user-profile-core/data-models';
import {
  RepresentativeDTO,
  RevenueAccountDTO,
} from '@profile-revenue-core/api';
import { updateAccountRepresentative } from '@profile-revenue-core/store';

@Component({
  selector: 'Tsk-managing-profile',
  templateUrl: './managing-profile.component.html',
  styleUrls: ['./managing-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ManagingProfileComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public revenueAccount: RevenueAccountDTO;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileDTO: ProfileDTO;
  public profileOptions: typeof Profiles = Profiles;
  public managersIcon: string = 'contacts';

  public userToken: UserTokenDTO;
  public profileImage: string = `url(${UserProfileConstants.DEFAULT_PROFILE_IMAGE}) center / contain no-repeat`;
  public detailsForm: FormGroup = this.formBuilder.group({
    phoneNumber: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
  });

  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private appResponseService: AppResponseService,
    private dateTimeService: DateTimeService
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

  public submitDetailsForm(): void {
    const isTheSameObject: boolean = false;

    if (isTheSameObject) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'common-errors.no-changes-detected',
      ]);
      return;
    }

    const details = this.detailsForm.value;
    const dateOfBirth = this.dateTimeService.createApiDateFormat(
      details.dateOfBirth
    );

    const representativeDTO: RepresentativeDTO = {
      userTokenDTO: this.revenueAccount.representative.userTokenDTO,
      phoneNumber: details.phoneNumber,
      dateOfBirth: dateOfBirth,
    };

    this.store.dispatch(
      updateAccountRepresentative({
        revenueAccountId: this.revenueAccount.revenueAccountId,
        representativeDTO: representativeDTO,
      })
    );
  }

  private processRevenueAccount(revenueAccount: RevenueAccountDTO): void {
    const representativeDTO = revenueAccount.representative;
    this.userToken = representativeDTO.userTokenDTO;
    const profileImage = this.userToken.profileImage;
    if (this.userToken?.profileImage) {
      this.profileImage = `url(${profileImage}) center center / contain no-repeat`;
    }

    this.detailsForm.patchValue({
      phoneNumber: representativeDTO.phoneNumber,
      dateOfBirth: representativeDTO.dateOfBirth,
    });
  }
}
