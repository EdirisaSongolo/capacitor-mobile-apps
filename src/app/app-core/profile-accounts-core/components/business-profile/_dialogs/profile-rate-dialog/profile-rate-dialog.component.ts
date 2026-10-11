import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { BreakPointService } from '@domain-services/break-point/break-point.service';

import {
  ProfileAccountsConstants,
  RateUnitsOptions,
} from '@profile-accounts-core/data-models';

@Component({
  selector: 'Tsk-profile-rate-dialog',
  templateUrl: './profile-rate-dialog.component.html',
  styleUrls: ['./profile-rate-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProfileRateDialogComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() public rateDetails: Map<string, string | number>;
  @Output() public closeDialog: EventEmitter<void> = new EventEmitter();
  @Output() public publishRateDetails: EventEmitter<
    Map<string, string | number>
  > = new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public closeIcon: string = 'remove';

  public profileBaseRate: number = 0.0;
  public profileRateUnits: string =
    ProfileAccountsConstants.RateUnitsOptionsList.not_selected;
  public rateUnitsValue: string = RateUnitsOptions.not_selected;
  public rateUnitsOptions: typeof RateUnitsOptions = RateUnitsOptions;
  public rateUnitsOptionsList: string[][] = Object.entries(
    ProfileAccountsConstants.RateUnitsOptionsList
  ).map(([key, name]) => {
    const value = RateUnitsOptions[key as keyof typeof RateUnitsOptions];
    return [value, name];
  });

  public baseRateForm: FormGroup = this.formBuilder.group({
    baseRate: ['0.00', Validators.required],
    rateUnits: [this.rateUnitsOptions.not_selected, Validators.required],
  });

  private rateUnits: string[][] = Object.entries(RateUnitsOptions).map(
    ([name, value]) => [name, value]
  );

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private formBuilder: FormBuilder,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const rateDetailsChanges = changes['rateDetails'];
    if (rateDetailsChanges?.currentValue) {
      this.processProfileRate(this.rateDetails);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public rateUnitsSelection(rateUnit: RateUnitsOptions): void {
    this.rateUnitsValue = rateUnit;
    this.baseRateForm.patchValue({ rateUnits: rateUnit });
  }

  public editProfileBaseRate(): void {
    this.baseRateForm.patchValue({
      baseRate: this.profileBaseRate,
      rateUnits: this.rateUnitsValue,
    });
  }

  public submitProviderBaseRate(): void {
    let invlaidForm: boolean = false;
    const errorMessages: string[] = [];
    if (this.baseRateForm.invalid) {
      invlaidForm = true;
      errorMessages.push('common-errors.required-fields');
    }

    const formValues: any = this.baseRateForm.value;
    const validRate = /^\d+(\.\d+)?$/.test(formValues.baseRate);
    if (!validRate || formValues.baseRate <= 0.0) {
      invlaidForm = true;
      errorMessages.push(
        'profile-accounts.business-profile.services.form-errors.valid-price'
      );
    }

    if (invlaidForm) {
      this.appResponseService.createAppResponse(
        AppResponseType.error,
        errorMessages
      );
      return;
    }

    const baseRateInCents: number = formValues.baseRate;
    const rateUnits = formValues.rateUnits;

    const baseRateValues: Map<string, string | number> = new Map();
    baseRateValues.set('baseRate', baseRateInCents);
    baseRateValues.set('rateUnits', rateUnits);
    this.publishRateDetails.emit(baseRateValues);
  }

  public closePaymentDialog(): void {
    this.closeDialog.emit();
  }

  private processProfileRate(rateDetails: Map<string, string | number>): void {
    const providerBaseRate = rateDetails.get('baseRate') as number;
    this.profileBaseRate = providerBaseRate;

    const providerRateUnits = rateDetails.get('rateUnits');
    const optionsList = ProfileAccountsConstants.RateUnitsOptionsList;

    this.rateUnits.forEach(([name, value]) => {
      if (value === providerRateUnits) {
        this.rateUnitsValue = value;
        this.profileRateUnits =
          optionsList[
            name as keyof typeof ProfileAccountsConstants.RateUnitsOptionsList
          ];
      }
    });

    this.baseRateForm.patchValue({
      baseRate: this.profileBaseRate,
      rateUnits: this.rateUnitsValue,
    });
  }
}
