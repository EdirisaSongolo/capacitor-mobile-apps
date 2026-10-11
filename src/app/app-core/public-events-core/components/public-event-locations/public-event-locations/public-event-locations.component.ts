import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { ComponentAction, Device } from '@domain-data-models/app-domain.enums';
import { Store } from '@ngrx/store';
import {
  PublicEventAction,
  LocationsDisplay,
} from '@public-events-core/data-models';
import { locationsDisplaySelector } from '@public-events-core/store/create-edit-event/create-edit-event.selectors';
import { setLocationsDisplay } from '@public-events-core/store';

@Component({
  selector: 'Tsk-public-event-locations',
  templateUrl: './public-event-locations.component.html',
  styleUrls: ['./public-event-locations.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventLocationsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.event_management;
  public publicEventAction: PublicEventAction;

  public locationsDisplay: LocationsDisplay =
    LocationsDisplay.create_edit_location;
  public panelOption: typeof LocationsDisplay = LocationsDisplay;

  private locationsDisplay$: Observable<LocationsDisplay> = this.store.select(
    locationsDisplaySelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const locationsDisplaySub = this.locationsDisplay$.subscribe(
      locationsDisplay => (this.locationsDisplay = locationsDisplay)
    );

    this.subscriptions.add(locationsDisplaySub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayCreateEditLocations(): void {
    this.locationsDisplay = this.panelOption.create_edit_location;
  }

  public updateDisplayPanel(locationDisplay: LocationsDisplay): void {
    this.store.dispatch(
      setLocationsDisplay({
        locationsDisplay: locationDisplay,
      })
    );
  }
}
