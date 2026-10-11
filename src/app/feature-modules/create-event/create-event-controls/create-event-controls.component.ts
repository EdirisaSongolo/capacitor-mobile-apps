import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Device, EventTypes } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { CreatePublicEventPanel } from '@public-events-core/data-models';
import {
  publicEventDisplaySelector,
  setPublicEventControl,
  setPublicEventDisplayPanel,
} from '@public-events-core/store/create-edit-event';
import { CreatePrivateEventPanel } from '@private-events-core/data-models';
import {
  updatePrivateEventControl,
  updatePrivateEventDisplayPanel,
  privateEventDisplaySelector,
} from '@private-events-core/store/create-edit-event';

@Component({
  selector: 'Tsk-controls',
  templateUrl: './create-event-controls.component.html',
  styleUrls: ['./create-event-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreateEventControlsComponent implements OnInit, OnDestroy {
  @Input() public eventType: EventTypes = EventTypes.publicEvent;
  @Input() public pageControls: any[] = [];

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayPanel: CreatePublicEventPanel | CreatePrivateEventPanel =
    CreatePublicEventPanel.category_name;

  private publicEventDisplay: Observable<CreatePublicEventPanel> =
    this.store.select(publicEventDisplaySelector);
  private privateEventDisplay: Observable<CreatePrivateEventPanel> =
    this.store.select(privateEventDisplaySelector);
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

    const publicEventDisplaySub = this.publicEventDisplay.subscribe(
      displayPanel => {
        if (this.eventType === EventTypes.publicEvent) {
          this.displayPanel = displayPanel;
        }
      }
    );

    this.subscriptions.add(publicEventDisplaySub);

    const privateEventDisplaySub = this.privateEventDisplay.subscribe(
      displayPanel => {
        if (this.eventType === EventTypes.privateEvent) {
          this.displayPanel = displayPanel;
        }
      }
    );

    this.subscriptions.add(privateEventDisplaySub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public switchDisplayPanel(control: any): void {
    if (control.event === EventTypes.publicEvent) {
      this.store.dispatch(
        setPublicEventDisplayPanel({ displayPanel: control.displayPanel })
      );
      this.store.dispatch(setPublicEventControl({ control: control }));
    } else if (control.event === EventTypes.privateEvent) {
      this.store.dispatch(updatePrivateEventControl({ control: control }));
      this.store.dispatch(
        updatePrivateEventDisplayPanel({ displayPanel: control.displayPanel })
      );
    }
  }
}
