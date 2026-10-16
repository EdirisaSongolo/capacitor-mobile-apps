import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import { PrivateEventConstants } from '@private-events-core/data-models';
import { PublicEventConstants } from '@public-events-core/data-models';
import { VendorsConstants } from '@vendors-core/data-models';
import { VenuesConstants } from '@venues-core/data-models';
import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DashBordRoutes } from '@domain-data-models/dash-board.routes';

@Component({
  selector: 'Tsk-dash-board-apps',
  templateUrl: './dash-board-apps.component.html',
  styleUrls: ['./dash-board-apps.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DashBoardAppsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public imageSize: string;

  public dashBoardApps: any[] = [
    {
      route: `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.VENUES}`,
      placImage: `url(${VenuesConstants.DEFAULT_PROFILE_IMAGE})`,
      name: 'labels.venue',
    },
    {
      route: `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.VENDORS}`,
      placImage: `url(${VendorsConstants.DEFAULT_PROFILE_IMAGE})`,
      name: 'labels.vendor',
    },
    {
      route: `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.PUBLIC_EVENTS}`,
      placImage: PublicEventConstants.DEFAULT_PROFILE_IMAGE,
      name: 'labels.public-event',
    },
    {
      route: `${DashBordRoutes.DASH_BOARD}/${DashBordRoutes.PRIVATE_EVENTS}`,
      placImage: PrivateEventConstants.DEFAULT_PROFILE_IMAGE,
      name: 'labels.private-event',
    },
  ];

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
      this.imageSize =
        this.device === this.deviceTypes.mobile ||
        this.device === this.deviceTypes.tablet
          ? '10rem'
          : '8rem';
    });
    this.subscriptions.add(breakpointSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayFeatureDashBoard(app: any): void {
    this.router.navigate([app.route]);
  }
}
