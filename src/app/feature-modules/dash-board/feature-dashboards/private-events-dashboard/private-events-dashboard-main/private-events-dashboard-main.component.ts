import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { userProfileLoadedSelector } from '@core-modules';

import { PrivateEventTokenDTO } from '@private-events-core/api';
import {
  retrieveUserManagedPrivateEvents,
  userManagedPrivateEventsSelector,
} from '@private-events-core/store';

@Component({
  selector: 'Tsk-private-events-dashboard-main',
  templateUrl: './private-events-dashboard-main.component.html',
  styleUrls: ['./private-events-dashboard-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivateEventsDashboardMainComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayPanel: number = 1;
  public managedPrivateEvents: PrivateEventTokenDTO[];

  private managedPrivateEvents$: Observable<PrivateEventTokenDTO[]> =
    this.store.select(userManagedPrivateEventsSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private profileLoaded$: Observable<boolean> = this.store.select(
    userProfileLoadedSelector
  );
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileLoadedSub = this.profileLoaded$.subscribe(profileLoaded => {
      if (profileLoaded) {
        this.store.dispatch(retrieveUserManagedPrivateEvents());
      }
    });

    this.subscriptions.add(profileLoadedSub);

    const managedPrivateEventsSub = this.managedPrivateEvents$.subscribe(
      privateEvents => (this.managedPrivateEvents = privateEvents)
    );

    this.subscriptions.add(managedPrivateEventsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public privateEventProfileDashboard(
    privateEvent: PrivateEventTokenDTO
  ): void {
    this.router.navigate(['profile', privateEvent.eventId], {
      relativeTo: this.activatedRoute,
    });
  }
}
