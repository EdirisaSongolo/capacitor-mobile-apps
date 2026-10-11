import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';

import {
  ProfileAccountsConstants,
  ServiceOption,
} from '@profile-accounts-core/data-models';
import { ProviderServiceDTO } from '@profile-accounts-core/api/profile-accounts.dto-models';

@Component({
  selector: 'Tsk-provider-service-plac',
  templateUrl: './provider-service-plac.component.html',
  styleUrls: ['./provider-service-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProviderServicePlacComponent implements OnInit, OnDestroy {
  @Input() public profileService: ProviderServiceDTO;
  @Input() public componentAction: ComponentAction;
  @Output() public editAction: EventEmitter<ProviderServiceDTO> =
    new EventEmitter();
  @Output() public deleteAction: EventEmitter<ProviderServiceDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public removeIcon: string = 'remove';
  public optionControl: string = 'more_vert';
  public option: string;

  public displayOptions: boolean = false;
  public actionsOptions: typeof ComponentAction = ComponentAction;

  private serviceOption: typeof ServiceOption = ServiceOption;
  private serviceOptionsList = ProfileAccountsConstants.ServiceOptionsList;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(private breakPoint: BreakPointService) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    this.option =
      this.profileService.option === this.serviceOption.included
        ? this.serviceOptionsList.included
        : this.serviceOptionsList.additional;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public toggleOptions(): void {
    this.displayOptions = !this.displayOptions;
  }

  public editProfileService(): void {
    this.editAction.emit(this.profileService);
  }

  public initiateDeleteAction(): void {
    this.deleteAction.emit(this.profileService);
  }
}
