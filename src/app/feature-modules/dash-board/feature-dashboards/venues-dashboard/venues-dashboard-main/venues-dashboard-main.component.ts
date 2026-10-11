import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { BreakPointService } from '@domain-services/index';
import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import {
  managedVenuesSelector,
  retrieveUserManagedVenues,
  setVenuesDetailsDisplay,
} from '@venues-core/store';
import { VenueTokenDTO } from '@app-core/venues-core/api';
import { ActivatedRoute, Router } from '@angular/router';

import { DetailsDisplay } from '@app-core/venues-core/data-models';

export enum VenuesMainDisplays {
  create_venue = 'create_venue',
  venues_list = 'venues_list',
}

@Component({
  selector: 'Tsk-venues-dashboard',
  templateUrl: './venues-dashboard-main.component.html',
  styleUrls: ['./venues-dashboard-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VenuesDashboardMainComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.dashboard;
  public displayPanel: VenuesMainDisplays = VenuesMainDisplays.venues_list;
  public panelOptions: typeof VenuesMainDisplays = VenuesMainDisplays;

  public venuesControls: any[] = [
    {
      name: 'venues-dashboard.navigation.main.venues-list',
      display: VenuesMainDisplays.venues_list,
    },
    {
      name: 'venues-dashboard.navigation.main.create-venue',
      display: VenuesMainDisplays.create_venue,
    },
  ];

  public managedVenues: any[] = [];
  public detailsDisplay: DetailsDisplay = DetailsDisplay.CREATE_VENUE;

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private managedVenues$: Observable<any[]> = this.store.select(
    managedVenuesSelector
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

    const managedVenuesSub = this.managedVenues$.subscribe(managedVenues => {
      if (managedVenues.length >= 1) {
        this.displayPanel = this.panelOptions.venues_list;
        this.managedVenues = managedVenues;
      } else {
        this.displayPanel = this.panelOptions.create_venue;
        this.store.dispatch(
          setVenuesDetailsDisplay({
            detailsDisplay: DetailsDisplay.CREATE_VENUE,
          })
        );
      }
    });

    this.subscriptions.add(managedVenuesSub);

    this.store.dispatch(retrieveUserManagedVenues());
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public venueProfileDashboard(venue: VenueTokenDTO): void {
    this.router.navigate(['profile', venue.venueProfileId], {
      relativeTo: this.activatedRoute,
    });
  }

  public updateDisplayPanel(displayPanel: VenuesMainDisplays): void {
    this.displayPanel = displayPanel;
  }
}
