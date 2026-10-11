import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Device, EventTypes } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import {
  CreateEventControl,
  CreatePublicEventPanel,
  PublicEventAction,
} from '@public-events-core/data-models';

import {
  publicEventControlSelector,
  publicEventDisplaySelector,
  setPublicEventAction,
} from '@public-events-core/store/create-edit-event';

@Component({
  selector: 'Tsk-create-public-event',
  templateUrl: './create-public-event.component.html',
  styleUrls: ['./create-public-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreatePublicEventComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public privateEventsIcon: string = 'private-events';
  public eventType: EventTypes = EventTypes.publicEvent;

  public displayPanel: CreatePublicEventPanel =
    CreatePublicEventPanel.category_name;
  public panelOptions: typeof CreatePublicEventPanel = CreatePublicEventPanel;

  public pageControls: CreateEventControl[] = [
    {
      index: 0,
      event: EventTypes.publicEvent,
      name: 'event-name',
      icon: 'page_info',
      displayPanel: CreatePublicEventPanel.category_name,
      completed: false,
    },
    {
      index: 1,
      event: EventTypes.publicEvent,
      name: 'event-poster',
      icon: 'dashboard_2',
      displayPanel: CreatePublicEventPanel.poster_description,
      completed: false,
    },
    {
      index: 2,
      event: EventTypes.publicEvent,
      name: 'event-location',
      icon: 'crop_portrait',
      displayPanel: CreatePublicEventPanel.event_locations,
      completed: false,
    },
    {
      index: 3,
      event: EventTypes.publicEvent,
      name: 'event-staff',
      icon: 'hdr_weak',
      displayPanel: CreatePublicEventPanel.event_vendors,
      completed: false,
    },
    {
      index: 4,
      event: EventTypes.publicEvent,
      name: 'event-management',
      icon: 'server_person',
      displayPanel: CreatePublicEventPanel.event_account,
      completed: false,
    },
    {
      index: 5,
      event: EventTypes.publicEvent,
      name: 'event-preview',
      icon: 'stream',
      displayPanel: CreatePublicEventPanel.preview_complete,
      completed: false,
    },
  ];

  private control: CreateEventControl = this.pageControls[0];
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private displayPanel$: Observable<CreatePublicEventPanel> = this.store.select(
    publicEventDisplaySelector
  );
  private control$: Observable<CreateEventControl> = this.store.select(
    publicEventControlSelector
  );
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
      setPublicEventAction({
        publicEventAction: PublicEventAction.create_event,
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // public updatePublicEventProfile(
  //   publicEventProfile: PublicEventProfileDTO
  // ): void {

  //   const controlIndex = this.control.index;
  //   const control: CreateEventControl = { ...this.control, completed: true };
  //   this.pageControls[controlIndex] = control;
  //   const updatedControl =
  //     controlIndex < this.pageControls.length && controlIndex !== 2
  //       ? this.pageControls[controlIndex + 1]
  //       : this.control;
  //   this.store.dispatch(updatePublicEventControl({ control: updatedControl }));
  //   this.store.dispatch(
  //     updatePublicEventDisplayPanel({
  //       displayPanel: updatedControl.displayPanel,
  //     })
  //   );
  // }
}
