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
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ComponentAction,
  DialogAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { GeoLocationService } from '@domain-services/geo-location-api/geo-location.service';
import {
  EventComponentDTO,
  LocationTokenDTO,
  PublicEventLocationDTO,
} from '@app-core/public-events-core/api';
import {
  EventComponents,
  LocationAction,
  LocationDateAction,
  LocationsDisplay,
  PublicEventAction,
} from '@public-events-core/data-models';

import {
  eventLocationsSelector,
  publicEventProfileImageSelector,
  publicEventActionSelector,
} from '@public-events-core/store/create-edit-event/create-edit-event.selectors';
import { Store } from '@ngrx/store';
import {
  retrievePublicEventLocations,
  setLocationAction,
  setLocationDateAction,
  setPublicEventLocation,
  updateEventLocations,
} from '@public-events-core/store/create-edit-event/create-edit-event.actions';
import { cancelPublicEventLocation } from '@public-events-core/store';
import { PublicEventMappersService } from '@public-events-core/services';
import { ProfileDTO } from '@app-core/app-api';
import { profileDTOSelector } from '@app-domain/store';
import { LocationMappersService } from '@domain-services/mappers';

@Component({
  selector: 'Tsk-create-edit-location',
  templateUrl: './create-edit-location.component.html',
  styleUrls: ['./create-edit-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreateEditLocationComponent implements OnInit, OnDestroy {
  @Output() public updateDisplayPanel: EventEmitter<LocationsDisplay> =
    new EventEmitter();
  @ViewChild('dialog_selector') deleteDialog!: ElementRef<HTMLDivElement>;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileImage: string | File;
  public locationsTokens: LocationTokenDTO[] = [];

  public iconOptions: any = {
    add: 'add',
    list: 'filter_list',
  };
  public locationsForm: boolean = false;
  public controlIcon: string = this.iconOptions.add;

  public componentAction: ComponentAction = ComponentAction.event_management;
  public confirmationDialog: boolean = false;

  public locationForm = this.formBuilder.group({
    locationInput: ['', Validators.required],
  });

  public possibleLocations: Observable<string[]>;
  public deleteConfirmation: string =
    'public-event-dashboard.confirm-location-deletion';

  private locationInput: string;
  private publicEventAction: PublicEventAction;
  private eventId: string;
  private profileDTO: ProfileDTO;
  private publicEventLocation: PublicEventLocationDTO;
  private eventLocations: PublicEventLocationDTO[] = [];

  private publicEventAction$: Observable<PublicEventAction> = this.store.select(
    publicEventActionSelector
  );
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private profileImage$: Observable<string | File> = this.store.select(
    publicEventProfileImageSelector
  );
  private eventLocations$: Observable<PublicEventLocationDTO[]> =
    this.store.select(eventLocationsSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private formBuilder: FormBuilder,
    private store: Store,
    private geoLocation: GeoLocationService,
    private locationMappers: LocationMappersService,
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

    const profileSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO && profileDTO.profile === Profiles.publicEventProfile) {
        this.profileDTO = profileDTO;
        this.eventId = this.profileDTO.profileId;
      }
    });

    this.subscriptions.add(profileSub);

    const publicEventActionSub = this.publicEventAction$.subscribe(
      publicEventAction => {
        this.publicEventAction = publicEventAction;
        if (publicEventAction === PublicEventAction.edit_event) {
          this.store.dispatch(
            retrievePublicEventLocations({ profileDTO: this.profileDTO })
          );
        }
      }
    );

    this.subscriptions.add(publicEventActionSub);

    const eventLocationsSub = this.eventLocations$.subscribe(eventLocations => {
      if (eventLocations.length >= 1) {
        this.eventLocations = [...eventLocations];
        this.locationsTokens = this.eventLocations.flatMap(location =>
          this.publicEventMappers.locationTokenDTOMapper(location)
        );
      }
    });

    this.subscriptions.add(eventLocationsSub);

    const init = () => {
      this.locationForm
        .get('locationInput')
        ?.valueChanges.subscribe(userInput => {
          this.locationInput = userInput as string;
          this.possibleLocations =
            this.geoLocation.locationAutoCompleteSuggestions(
              this.locationInput
            );
        });
    };
    init();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayLocationsForm(): void {
    this.locationsForm = !this.locationsForm;
    this.controlIcon = this.locationForm
      ? this.iconOptions.list
      : this.iconOptions.add;
  }

  public async createPublicEventLocation(): Promise<void> {
    const locationDetails = await this.geoLocation.retrieveGeoLocationData(
      this.locationInput
    );

    const locationDTO = this.locationMappers.createLocationDTO(locationDetails);
    const eventLocation: PublicEventLocationDTO = {
      locationId: `temp_${crypto.randomUUID()}`,
      eventCity: locationDTO.city,
      eventState: locationDTO.state,
      eventCountry: locationDTO.country,
      eventLatitude: locationDTO.latitude,
      eventLongitude: locationDTO.longitude,
      eventTimeZone: locationDTO.timeZone,
      eventDates: [],
    };

    if (this.publicEventAction === PublicEventAction.edit_event) {
      eventLocation.eventId = this.eventId;
    }

    this.store.dispatch(
      setPublicEventLocation({ publicEventLocation: eventLocation })
    );
    this.store.dispatch(
      setLocationAction({
        locationAction: LocationAction.create_location,
      })
    );
    this.store.dispatch(
      setLocationDateAction({
        locationDateAction: LocationDateAction.create_date,
      })
    );
    this.updateDisplayPanel.emit(LocationsDisplay.create_edit_date);
  }

  public editPublicEventLocation(locationToken: LocationTokenDTO): void {
    const eventLocation: PublicEventLocationDTO = this.eventLocations.find(
      location => location.locationId === locationToken.locationId
    );

    this.store.dispatch(
      setPublicEventLocation({ publicEventLocation: eventLocation })
    );

    this.store.dispatch(
      setLocationAction({
        locationAction: LocationAction.edit_location,
      })
    );

    this.updateDisplayPanel.emit(LocationsDisplay.public_event_location);
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

  public displayConfirmationDialog(locationToken: LocationTokenDTO): void {
    const eventLocation: PublicEventLocationDTO = this.eventLocations.find(
      location => location.locationId === locationToken.locationId
    );
    this.publicEventLocation = eventLocation;
    this.confirmationDialog = true;
  }

  public deleteDialogAction(deleteDialogAction: DialogAction): void {
    if (deleteDialogAction === DialogAction.cancelled) {
      this.closeConfirmationDialog();
    } else if (deleteDialogAction === DialogAction.confirmed) {
      this.deletePublicEventLocation();
    }
  }

  private deletePublicEventLocation(): void {
    if (this.publicEventAction === PublicEventAction.create_event) {
      const updatedLocationDates = this.eventLocations.filter(
        location => location.locationId !== this.publicEventLocation.locationId
      );

      this.store.dispatch(
        updateEventLocations({ eventLocations: updatedLocationDates })
      );
    } else if (this.publicEventAction === PublicEventAction.edit_event) {
      const eventComponent: EventComponentDTO = {
        component: EventComponents.event_location,
        componentId: this.publicEventLocation.locationId,
      };

      this.store.dispatch(
        cancelPublicEventLocation({
          eventComponent: eventComponent,
          profileDTO: this.profileDTO,
        })
      );
    }

    this.updateDisplayPanel.emit(LocationsDisplay.create_edit_location);
    this.closeConfirmationDialog();
  }

  private closeConfirmationDialog(): void {
    this.confirmationDialog = false;
  }
}
