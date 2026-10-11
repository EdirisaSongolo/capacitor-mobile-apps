import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ComponentAction,
  DialogAction,
  Device,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import {
  DateTokenDTO,
  EventComponentDTO,
  PublicEventDateDTO,
  PublicEventLocationDTO,
} from '@app-core/public-events-core/api';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  eventLocationsSelector,
  locationActionSelector,
  locationDateActionSelector,
  publicEventProfileImageSelector,
  publicEventActionSelector,
  publicEventLocationSelector,
} from '@public-events-core/store/create-edit-event/create-edit-event.selectors';
import {
  EventComponents,
  LocationAction,
  LocationDateAction,
  LocationsDisplay,
  PublicEventAction,
} from '@app-core/public-events-core/data-models';
import {
  retrievePublicEventLocation,
  setLocationAction,
  setLocationDateAction,
  setPublicEventDate,
  setPublicEventLocation,
  updateEventLocations,
} from '@public-events-core/store/create-edit-event/create-edit-event.actions';
import { cancelPublicEventDate } from '@app-core/public-events-core/store';
import { PublicEventMappersService } from '@public-events-core/services';

@Component({
  selector: 'Tsk-public-event-location',
  templateUrl: './public-event-location.component.html',
  styleUrls: ['./public-event-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventLocationComponent implements OnInit, OnDestroy {
  @Output() public updateDisplayPanel: EventEmitter<LocationsDisplay> =
    new EventEmitter();
  @ViewChild('dialog_selector') deleteDialog!: ElementRef<HTMLDivElement>;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileImage: string | File;
  public locationDatesTokens: DateTokenDTO[] = [];
  public publicEventLocation: PublicEventLocationDTO;
  public componentAction: ComponentAction = ComponentAction.event_management;

  public addControl: string = 'add';
  public displayOptions: boolean = false;
  public confirmationDialog: boolean = false;
  public deleteConfirmation: string =
    'public-event-dashboard.confirm-date-deletion';

  private publicEventAction: PublicEventAction;
  private locationAction: LocationAction;
  private locationDateAction: LocationDateAction;

  private dateLocation: EventComponentDTO;
  private publicEventDate: PublicEventDateDTO;
  private locationDates: PublicEventDateDTO[] = [];
  private eventLocations: PublicEventLocationDTO[] = [];

  private profileImage$: Observable<string | File> = this.store.select(
    publicEventProfileImageSelector
  );
  private publicEventAction$: Observable<PublicEventAction> = this.store.select(
    publicEventActionSelector
  );
  private locationAction$: Observable<LocationAction> = this.store.select(
    locationActionSelector
  );
  private locationDateAction$: Observable<LocationDateAction> =
    this.store.select(locationDateActionSelector);

  private publicEventLocation$: Observable<PublicEventLocationDTO> =
    this.store.select(publicEventLocationSelector);
  private eventLocations$: Observable<PublicEventLocationDTO[]> =
    this.store.select(eventLocationsSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private publicEventMappers: PublicEventMappersService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileImageSub = this.profileImage$.subscribe(profileImage => {
      if (profileImage) {
        this.profileImage = profileImage;
      }
    });

    this.subscriptions.add(profileImageSub);

    const publicEventLocationSub = this.publicEventLocation$.subscribe(
      publicEventLocation => {
        this.publicEventLocation = publicEventLocation;
        if (this.publicEventLocation.eventDates) {
          this.locationDates = [...this.publicEventLocation.eventDates];
          this.locationDatesTokens = this.locationDates.flatMap(date =>
            this.publicEventMappers.dateTokenDTOMapper(date)
          );
        }
      }
    );

    this.subscriptions.add(publicEventLocationSub);

    const eventLocationsSub = this.eventLocations$.subscribe(eventLocations => {
      this.eventLocations = eventLocations;
    });

    this.subscriptions.add(eventLocationsSub);

    const publicEventActionSub = this.publicEventAction$.subscribe(
      publicEventAction => {
        this.publicEventAction = publicEventAction;
        if (publicEventAction === PublicEventAction.edit_event) {
          this.dateLocation = {
            component: EventComponents.event_location,
            componentId: this.publicEventLocation.locationId,
          };

          this.store.dispatch(
            retrievePublicEventLocation({
              eventComponent: this.dateLocation,
            })
          );
        }
      }
    );

    this.subscriptions.add(publicEventActionSub);

    const locationActionSub = this.locationAction$.subscribe(
      locationAction => (this.locationAction = locationAction)
    );

    this.subscriptions.add(locationActionSub);

    const locationDateActionSub = this.locationDateAction$.subscribe(
      locationDateAction => (this.locationDateAction = locationDateAction)
    );

    this.subscriptions.add(locationDateActionSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public createLocationDate(): void {
    this.store.dispatch(setPublicEventDate({ publicEventDate: null }));
    this.store.dispatch(
      setLocationAction({ locationAction: LocationAction.edit_location })
    );
    this.store.dispatch(
      setLocationDateAction({
        locationDateAction: LocationDateAction.create_date,
      })
    );
    this.updateDisplayPanel.emit(LocationsDisplay.create_edit_date);
  }

  public editPublicEventDate(dateToken: DateTokenDTO): void {
    const publicEventDate: PublicEventDateDTO = this.locationDates.find(
      locationDate => locationDate.dateId === dateToken.dateId
    );
    this.store.dispatch(
      setPublicEventDate({ publicEventDate: publicEventDate })
    );
    this.store.dispatch(
      setLocationDateAction({
        locationDateAction: LocationDateAction.edit_date,
      })
    );
    this.updateDisplayPanel.emit(LocationsDisplay.create_edit_date);
  }

  public componentClickEvent(event: MouseEvent): void {
    const dialogClicked = this.deleteDialog?.nativeElement.contains(
      event.target as Node
    );

    if (!dialogClicked) {
      this.closeConfirmationDialog();
    }
  }

  public dialogClickEvent(event: MouseEvent): void {
    event.stopPropagation();
  }

  public displayConfirmationDialog(dateToken: DateTokenDTO): void {
    const publicEventDate: PublicEventDateDTO = this.locationDates.find(
      locationDate => locationDate.dateId === dateToken.dateId
    );
    this.publicEventDate = publicEventDate;
    this.confirmationDialog = true;
  }

  public deleteDialogAction(deleteDialogAction: DialogAction): void {
    if (deleteDialogAction === DialogAction.cancelled) {
      this.closeConfirmationDialog();
    } else if (deleteDialogAction === DialogAction.confirmed) {
      this.deleteEventDate();
    }
  }

  private deleteEventDate(): void {
    if (this.publicEventAction === PublicEventAction.create_event) {
      const updatedLocationDates = this.locationDates.filter(
        date => date.dateId !== this.publicEventDate.dateId
      );

      this.publicEventLocation = {
        ...this.publicEventLocation,
        eventDates: [...updatedLocationDates],
      };

      this.updatePublicEventLocations(this.publicEventLocation);
    } else if (this.publicEventAction === PublicEventAction.edit_event) {
      const eventComponent: EventComponentDTO = {
        component: EventComponents.event_date,
        componentId: this.publicEventDate.dateId,
      };

      this.store.dispatch(
        cancelPublicEventDate({
          eventDate: eventComponent,
          dateLocation: this.dateLocation,
        })
      );
    }

    this.updateDisplayPanel.emit(LocationsDisplay.public_event_location);
    this.closeConfirmationDialog();
  }

  private closeConfirmationDialog(): void {
    this.confirmationDialog = false;
  }

  private updatePublicEventLocations(
    publicEventLocation: PublicEventLocationDTO
  ): void {
    this.store.dispatch(
      setPublicEventLocation({ publicEventLocation: publicEventLocation })
    );

    const eventLocations = [...this.eventLocations];
    const locationIndex: number = eventLocations.findIndex(
      location => location.locationId === publicEventLocation.locationId
    );
    eventLocations[locationIndex] = publicEventLocation;

    this.store.dispatch(
      updateEventLocations({ eventLocations: eventLocations })
    );
  }
}
