import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'Tsk-app-display',
  templateUrl: './app-display.component.html',
  styleUrls: ['./app-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppDisplayComponent implements OnInit, OnDestroy {
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
