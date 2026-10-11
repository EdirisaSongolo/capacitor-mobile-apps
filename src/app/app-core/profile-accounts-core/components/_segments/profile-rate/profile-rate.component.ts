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

@Component({
  selector: 'Tsk-profile-rate',
  templateUrl: './profile-rate.component.html',
  styleUrls: ['./profile-rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProfileRateComponent implements OnInit, OnDestroy {
  @Input() public profileBaseRate: number;
  @Input() public profileRateUnits: string;

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
