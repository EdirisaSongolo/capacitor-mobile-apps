import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { ProviderServiceDTO } from '@profile-accounts-core/api';

@Component({
  selector: 'Tsk-profile-services',
  templateUrl: './profile-services.component.html',
  styleUrls: ['./profile-services.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProfileServicesComponent implements OnInit, OnDestroy {
  @Input() public profileServices: ProviderServiceDTO[] = [];

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(private breakPoint: BreakPointService) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
