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
  ServiceDialogAction,
  ServiceOption,
} from '@profile-accounts-core/data-models';
import { ProviderServiceDTO } from '@profile-accounts-core/api';

@Component({
  selector: 'Tsk-profile-service-dialog',
  templateUrl: './profile-service-dialog.component.html',
  styleUrls: ['./profile-service-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProfileServiceDialogComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() public dialogAction: ServiceDialogAction;
  @Input() public providerService: ProviderServiceDTO;
  @Output() public closeDialog: EventEmitter<void> = new EventEmitter();
  @Output() public publishProviderService: EventEmitter<ProviderServiceDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public dialogTitle: string;
  public closeIcon: string = 'remove';
  public serviceOptionValue: string = ServiceOption.included;
  public serviceOptions: typeof ServiceOption = ServiceOption;
  public serviceOptionsList: string[][] = Object.entries(
    ProfileAccountsConstants.ServiceOptionsList
  ).map(([key, name]) => {
    const value = ServiceOption[key as keyof typeof ServiceOption];
    return [value, name];
  });

  public serviceForm: FormGroup = this.formBuilder.group({
    serviceOption: [this.serviceOptions.included],
    service: ['', Validators.required],
    price: [
      {
        value: '',
        disabled: this.serviceOptionValue === this.serviceOptions.included,
      },
    ],
  });

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
    const dialogActionChanges = changes['dialogAction'];
    if (dialogActionChanges?.currentValue) {
      this.processDialogAction(this.dialogAction);
    }

    const profileServiceChanges = changes['providerService'];
    if (profileServiceChanges?.currentValue) {
      this.processProviderService(this.providerService);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public serviceOptionSelection(selectedOption: ServiceOption): void {
    this.serviceOptionValue = selectedOption;
    this.serviceForm.patchValue({ serviceOption: selectedOption });

    if (this.serviceOptionValue === this.serviceOptions.additional) {
      this.serviceForm.get('price').enable();
      this.serviceForm.patchValue({ price: this.providerService?.price });
    } else if (this.serviceOptionValue === this.serviceOptions.included) {
      this.serviceForm.get('price').disable();
      this.serviceForm.patchValue({ price: '' });
    }
  }

  public submitProviderService(): void {
    let invlaidForm: boolean = false;
    const errorMessages: string[] = [];

    if (this.serviceForm.get('service').invalid) {
      invlaidForm = true;
      errorMessages.push(
        'profile-accounts.business-profile.services.form-errors.name-required'
      );
    }

    const formValues: any = this.serviceForm.value;
    if (formValues?.serviceOption === ServiceOption.additional) {
      const validPrice = /^\d+(\.\d+)?$/.test(formValues.price);
      if (!validPrice || formValues.price <= 0.0) {
        invlaidForm = true;
        errorMessages.push(
          'profile-accounts.business-profile.services.form-errors.price-required'
        );
      }
    }

    if (invlaidForm) {
      this.appResponseService.createAppResponse(
        AppResponseType.error,
        errorMessages
      );
      return;
    }

    const providerService: ProviderServiceDTO = {
      serviceProviderId: '',
      option: formValues.serviceOption
        ? formValues.serviceOption
        : this.serviceOptions.included,
      service: formValues?.service,
      price: formValues?.price,
    };

    if (this.dialogAction === ServiceDialogAction.editService) {
      providerService.serviceId = this.providerService.serviceId;
    }

    this.publishProviderService.emit(providerService);
  }

  private processDialogAction(dialogAction: ServiceDialogAction): void {
    if (dialogAction === ServiceDialogAction.createService) {
      this.dialogAction = ServiceDialogAction.createService;
      this.dialogTitle =
        'profile-accounts.business-profile.services.create-service';
    } else if (dialogAction === ServiceDialogAction.editService) {
      this.dialogAction = ServiceDialogAction.editService;
      this.dialogTitle =
        'profile-accounts.business-profile.services.edit-service';
    }
  }

  public closeServiceDialog(): void {
    this.closeDialog.emit();
  }

  private processProviderService(providerService: ProviderServiceDTO): void {
    this.providerService = providerService;

    this.serviceForm.patchValue({
      service: providerService.service,
      serviceOption: providerService.option as string,
    });

    this.serviceOptionSelection(providerService.option);
  }
}
