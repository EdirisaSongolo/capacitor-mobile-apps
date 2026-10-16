import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  ComponentAction,
  Device,
  EventTypes,
} from '@domain-data-models/app-domain.enums';
import {
  CreateEventControl,
  CreatePrivateEventPanel,
  PrivateEventAction,
} from '@private-events-core/data-models';
import { BreakPointService } from '@domain-services/index';
import { PrivateEventLocationDTO } from '@private-events-core/api/private-events.dto-models';
import {
  privateEventControlSelector,
  privateEventDisplaySelector,
  privateEventLocationSelector,
  updatePrivateEventDisplayPanel,
  setPrivateEventAction,
} from '@app-core/private-events-core/store/create-edit-event';

@Component({
  selector: 'Tsk-create-private-event',
  templateUrl: './create-private-event.component.html',
  styleUrls: ['./create-private-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreatePrivateEventComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.dashboard;
  public eventType: EventTypes = EventTypes.privateEvent;

  public displayPanel: CreatePrivateEventPanel;
  public createEventPanel: typeof CreatePrivateEventPanel =
    CreatePrivateEventPanel;

  public pageControls: CreateEventControl[] = [
    {
      index: 0,
      event: EventTypes.privateEvent,
      name: 'event-name',
      icon: 'page_info',
      displayPanel: CreatePrivateEventPanel.name_profileImage,
      completed: false,
    },
    {
      index: 1,
      event: EventTypes.privateEvent,
      name: 'event-poster',
      icon: 'dashboard_2',
      displayPanel: CreatePrivateEventPanel.media_invitation,
      completed: false,
    },
    {
      index: 2,
      event: EventTypes.privateEvent,
      name: 'event-location',
      icon: 'crop_portrait',
      displayPanel: CreatePrivateEventPanel.date_location,
      completed: false,
    },
    {
      index: 3,
      event: EventTypes.privateEvent,
      name: 'event-vendors',
      icon: 'hdr_weak',
      displayPanel: CreatePrivateEventPanel.event_staff,
      completed: false,
    },
    {
      index: 4,
      event: EventTypes.privateEvent,
      name: 'event-guests',
      icon: 'stacks',
      displayPanel: CreatePrivateEventPanel.event_guests,
      completed: false,
    },
    {
      index: 5,
      event: EventTypes.privateEvent,
      name: 'event-complete',
      icon: 'stream',
      displayPanel: CreatePrivateEventPanel.preview_create,
      completed: false,
    },
  ];

  private control: CreateEventControl = this.pageControls[0];
  private control$: Observable<CreateEventControl> = this.store.select(
    privateEventControlSelector
  );
  private displayPanel$: Observable<CreatePrivateEventPanel> =
    this.store.select(privateEventDisplaySelector);
  private eventLocation$: Observable<PrivateEventLocationDTO> =
    this.store.select(privateEventLocationSelector);

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

    const controlSub = this.control$.subscribe(control => {
      if (control && control !== null) this.control = control;
    });

    this.subscriptions.add(controlSub);

    const displayPanelSub = this.displayPanel$.subscribe(
      displayPanel => (this.displayPanel = displayPanel)
    );

    this.subscriptions.add(displayPanelSub);

    this.store.dispatch(
      setPrivateEventAction({
        privateEventAction: PrivateEventAction.create_event,
      })
    );

    this.store.dispatch(
      updatePrivateEventDisplayPanel({
        displayPanel: CreatePrivateEventPanel.name_profileImage,
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
