import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { BreakPointService } from '@domain-services/index';
import { userProfileLoadedSelector } from '@core-modules';
import { Device } from '@domain-data-models/app-domain.enums';
import { PublicEventTokenDTO } from '@public-events-core/api';
import {
  publicEventsSelector,
  retrieveUserManagedPublicEvents,
} from '@public-events-core/store';

@Component({
  selector: 'Tsk-public-events-dashboard',
  templateUrl: './public-events-dashboard-main.component.html',
  styleUrls: ['./public-events-dashboard-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventsDashboardMainComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public managedPublicEvents: PublicEventTokenDTO[];

  private managedPublicEvents$: Observable<PublicEventTokenDTO[]> =
    this.store.select(publicEventsSelector);
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
        this.store.dispatch(retrieveUserManagedPublicEvents());
      }
    });

    this.subscriptions.add(profileLoadedSub);

    const managedPublicEventsSub = this.managedPublicEvents$.subscribe(
      publicEvets => (this.managedPublicEvents = publicEvets)
    );

    this.subscriptions.add(managedPublicEventsSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public publicEventProfileDashboard(publicEvent: PublicEventTokenDTO): void {
    this.router.navigate(['profile', publicEvent.eventId], {
      relativeTo: this.activatedRoute,
    });
  }
}
