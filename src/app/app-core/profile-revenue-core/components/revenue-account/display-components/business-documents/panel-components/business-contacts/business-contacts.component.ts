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
  BusinessContactsDTO,
  RevenueAccountDTO,
} from '@profile-revenue-core/api';
import { updateAccountBusinessContacts } from '@profile-revenue-core/store';

@Component({
  selector: 'Tsk-business-contacts',
  templateUrl: './business-contacts.component.html',
  styleUrls: ['./business-contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BusinessContactsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public revenueAccount: RevenueAccountDTO;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileDTO: ProfileDTO;
  public profileOptions: typeof Profiles = Profiles;

  public businessContactsForm = this.formBuilder.group({
    emailAddress: ['', Validators.required],
    phoneNumber: ['', Validators.required],
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
        //TODO:: For some reason the profileDTO here is undfined. Never resolved
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

  public submitBusinessContactsForm(): void {
    const isTheSameObject: boolean = false;

    if (isTheSameObject) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'common-errors.no-changes-detected',
      ]);
      return;
    }

    const businessContactsForm = this.businessContactsForm.value;

    const businessContactsDTO: BusinessContactsDTO = {
      emailAddress: businessContactsForm.emailAddress,
      phoneNumber: businessContactsForm.phoneNumber,
    };

    this.store.dispatch(
      updateAccountBusinessContacts({
        revenueAccountId: this.revenueAccount.revenueAccountId,
        businessContactsDTO: businessContactsDTO,
      })
    );
  }

  private processRevenueAccount(revenueAccount: RevenueAccountDTO): void {
    const contactInformation: BusinessContactsDTO =
      revenueAccount.businessContacts;
    this.businessContactsForm.patchValue({
      emailAddress: contactInformation.emailAddress,
      phoneNumber: contactInformation.phoneNumber,
    });
  }
}
