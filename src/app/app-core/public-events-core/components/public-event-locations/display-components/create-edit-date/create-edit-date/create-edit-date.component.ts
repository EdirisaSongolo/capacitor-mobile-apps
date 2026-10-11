import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  AppResponseType,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import {
  ProviderRequestDTO,
  LocationDTO,
  ProfileDTO,
} from '@app-core/app-api/app-api.dto-models';

import {
  CreateEventDateDTO,
  CreateEventLocationDTO,
  DateDetailsDTO,
  EventComponentDTO,
  PublicEventDateDTO,
  PublicEventLocationDTO,
} from '@app-core/public-events-core/api';
import {
  EventComponents,
  LocationAction,
  LocationDateAction,
  LocationsDisplay,
  PublicEventAction,
} from '@app-core/public-events-core/data-models';
import { VenueTokenDTO } from '@app-core/venues-core/api';
import {
  createPublicEventDate,
  createPublicEventLocation,
} from '@app-core/public-events-core/store';
import {
  eventLocationsSelector,
  locationActionSelector,
  locationDateActionSelector,
  publicEventActionSelector,
  publicEventDateSelector,
  publicEventLocationSelector,
} from '@public-events-core/store/create-edit-event/create-edit-event.selectors';
import {
  retrievePublicEventDate,
  setPublicEventDate,
  setPublicEventLocation,
  updateEventLocations,
} from '@public-events-core/store/create-edit-event/create-edit-event.actions';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { ProfileMapperService } from '@profile-accounts-core/services';
import { LocationMappersService } from '@domain-services/mappers';

interface Indicator {
  position: string;
  index: number;
}

@Component({
  selector: 'Tsk-create-edit-date',
  templateUrl: './create-edit-date.component.html',
  styleUrls: ['./create-edit-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreateEditDateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('date_panels') datePanels!: ElementRef<HTMLDivElement>;
  @Output() public updateDisplayPanel: EventEmitter<LocationsDisplay> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public location: LocationDTO;
  public publicEventDate: PublicEventDateDTO;
  public dateVenue: VenueTokenDTO;
  public dateFeatures: ServiceProviderDTO[] = [];

  public panel: string = 'center';
  public indicators: Indicator[] = [
    { position: 'left', index: 0 },
    { position: 'center', index: 800 },
    { position: 'right', index: 1600 },
  ];

  private publicEventAction: PublicEventAction;
  private locationAction: LocationAction;
  private locationDateAction: LocationDateAction;
  private eventLocations: PublicEventLocationDTO[] = [];
  private publicEventLocation: PublicEventLocationDTO;

  private createFeatureProfiles: ProviderRequestDTO[] = [];

  private publicEventAction$: Observable<PublicEventAction> = this.store.select(
    publicEventActionSelector
  );
  private locationAction$: Observable<LocationAction> = this.store.select(
    locationActionSelector
  );
  private locationDateAction$: Observable<LocationDateAction> =
    this.store.select(locationDateActionSelector);
  private eventLocations$: Observable<PublicEventLocationDTO[]> =
    this.store.select(eventLocationsSelector);
  private publicEventLocation$: Observable<PublicEventLocationDTO> =
    this.store.select(publicEventLocationSelector);
  private publicEventDate$: Observable<PublicEventDateDTO> = this.store.select(
    publicEventDateSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private profileMappers: ProfileMapperService,
    private locationMappers: LocationMappersService,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const publicEventLocationSub = this.publicEventLocation$.subscribe(
      publicEventLocation => {
        this.publicEventLocation = publicEventLocation;
        this.location = this.locationMappers.publicEventLocationDTO(
          this.publicEventLocation
        );
      }
    );

    this.subscriptions.add(publicEventLocationSub);

    const publicEventDateSub = this.publicEventDate$.subscribe(
      publicEventDate => {
        if (publicEventDate) {
          this.publicEventDate = publicEventDate;
          this.dateFeatures = this.publicEventDate?.dateFeatures;
          this.dateVenue = this.publicEventDate?.dateVenue;
        }
      }
    );

    this.subscriptions.add(publicEventDateSub);

    const publicEventActionSub = this.publicEventAction$.subscribe(
      publicEventAction => (this.publicEventAction = publicEventAction)
    );

    this.subscriptions.add(publicEventActionSub);

    const locationActionSub = this.locationAction$.subscribe(
      locationAction => (this.locationAction = locationAction)
    );

    this.subscriptions.add(locationActionSub);

    const locationDateActionSub = this.locationDateAction$.subscribe(
      locationDateAction => {
        this.locationDateAction = locationDateAction;
        if (
          this.publicEventAction === PublicEventAction.edit_event &&
          this.locationDateAction === LocationDateAction.edit_date
        ) {
          const eventComponent: EventComponentDTO = {
            component: EventComponents.event_date,
            componentId: this.publicEventDate.dateId,
          };
          this.store.dispatch(
            retrievePublicEventDate({ eventComponent: eventComponent })
          );
        }
      }
    );

    this.subscriptions.add(locationDateActionSub);

    const eventLocationsSub = this.eventLocations$.subscribe(eventLocations => {
      this.eventLocations = eventLocations;
    });

    this.subscriptions.add(eventLocationsSub);
  }

  public ngAfterViewInit(): void {
    const panelsContainer = this.datePanels.nativeElement;
    const panelWidth = panelsContainer.clientWidth;
    panelsContainer.scrollTo({
      left: panelWidth,
      behavior: 'auto',
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onScroll(): void {
    const panelsContainer = this.datePanels.nativeElement;
    const scroll = panelsContainer.scrollLeft;
    this.indicators.forEach(indicator => {
      if (indicator.index === scroll) {
        this.panel = indicator.position;
      }
    });
  }

  public panelNavigation(indicator: Indicator): void {
    const panelsContainer = this.datePanels.nativeElement;
    panelsContainer.scrollTo({
      left: indicator.index,
      behavior: 'auto',
    });
    this.panel = indicator.position;
  }

  public setEventDateVenue(venue: VenueTokenDTO): void {
    this.dateVenue = { ...venue };
  }

  public appendDateFeatureProfile(providerRequest: ProviderRequestDTO): void {
    if (this.locationDateAction === LocationDateAction.create_date) {
      this.createFeatureProfiles.push(providerRequest);
    } else if (this.locationDateAction === LocationDateAction.edit_date) {
      const serviceProvider: ServiceProviderDTO =
        this.profileMappers.profileToServiceProviderDTO(
          providerRequest.provider
        );

      const features = this.publicEventDate?.dateFeatures
        ? [...this.publicEventDate.dateFeatures]
        : [];
      features.push(serviceProvider);

      const locationDate: PublicEventDateDTO = {
        ...this.publicEventDate,
        dateFeatures: [...features],
      };

      this.publicEventDate = { ...locationDate };
      this.updatePublicEventLocations();
    }
  }

  public removeDateFeatureProfile(providerRequest: ProviderRequestDTO): void {
    if (this.locationDateAction === LocationDateAction.create_date) {
      const createProfiles = this.createFeatureProfiles.filter(request => {
        const feature = request.provider;
        const provider = providerRequest.provider;

        return feature.profileId !== provider.profileId;
      });

      this.createFeatureProfiles = [...createProfiles];
    } else if (this.locationDateAction === LocationDateAction.edit_date) {
      const features = this.publicEventDate.dateFeatures;
      const provider = providerRequest.provider;

      const profileDTOs: ProfileDTO[] = features.map(feature =>
        this.profileMappers.serviceProviderToProfileDTO(feature)
      );
      const featuresList = profileDTOs.filter(
        feature => feature.profileId !== provider.profileId
      );

      const serviceProviders = featuresList.map(feature =>
        this.profileMappers.profileToServiceProviderDTO(feature)
      );

      const locationDate: PublicEventDateDTO = {
        ...this.publicEventDate,
        dateFeatures: [...serviceProviders],
      };

      this.publicEventDate = { ...locationDate };
      this.updatePublicEventLocations();
    }
  }

  public createEventDate(dateDetails: DateDetailsDTO): void {
    if (!this.dateVenue) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'create-event.public-event.notifications.date-venue-tickets-required',
      ]);
      return;
    }

    const serviceProviders: ServiceProviderDTO[] =
      this.createFeatureProfiles.map(providerRequest =>
        this.profileMappers.profileToServiceProviderDTO(
          providerRequest.provider
        )
      );

    const publicEventDate: PublicEventDateDTO = {
      dateId: dateDetails.dateId,
      locationId: dateDetails.locationId,
      eventDate: dateDetails.eventDate,
      startTime: dateDetails.startTime,
      endTime: dateDetails.endTime,
      dateVenue: this.dateVenue,
      eventTickets: dateDetails.eventTickets,
      dateFeatures: [...serviceProviders],
    };

    const publicEventLocation = { ...this.publicEventLocation };

    if (
      this.locationAction === LocationAction.create_location &&
      this.locationDateAction === LocationDateAction.create_date
    ) {
      publicEventLocation.eventDates = [publicEventDate];
    } else if (
      this.locationAction === LocationAction.edit_location &&
      this.locationDateAction === LocationDateAction.create_date
    ) {
      const locationDates = [
        ...publicEventLocation.eventDates,
        publicEventDate,
      ];
      publicEventLocation.eventDates = [...locationDates];
    } else if (
      this.locationAction === LocationAction.edit_location &&
      this.locationDateAction === LocationDateAction.edit_date
    ) {
      const editedDate: PublicEventDateDTO = {
        ...this.publicEventDate,
        eventDate: dateDetails.eventDate,
        startTime: dateDetails.startTime,
        endTime: dateDetails.endTime,
        dateVenue: this.dateVenue,
        eventTickets: dateDetails.eventTickets,
      };

      const locationDates = [...publicEventLocation.eventDates];
      const dateIndex: number = locationDates.findIndex(
        date => date.dateId === editedDate.dateId
      );
      locationDates[dateIndex] = editedDate;
      publicEventLocation.eventDates = [...locationDates];
    }

    if (this.publicEventAction === PublicEventAction.create_event) {
      this.store.dispatch(
        setPublicEventLocation({ publicEventLocation: publicEventLocation })
      );

      const eventLocations = [...this.eventLocations];
      const locationIndex: number = eventLocations.findIndex(
        location => location.locationId === publicEventLocation.locationId
      );

      if (locationIndex >= 0) {
        eventLocations[locationIndex] = publicEventLocation;
      } else if (locationIndex === -1) {
        eventLocations.push(publicEventLocation);
      }

      this.store.dispatch(
        updateEventLocations({ eventLocations: eventLocations })
      );

      this.updateDisplayPanel.emit(LocationsDisplay.public_event_location);
    } else if (this.publicEventAction === PublicEventAction.edit_event) {
      const createEventDate: CreateEventDateDTO = {
        locationId: dateDetails.locationId,
        venueId: this.dateVenue.venueProfileId,
        eventDate: dateDetails.eventDate,
        startTime: dateDetails.startTime,
        endTime: dateDetails.endTime,
        eventTickets: dateDetails.eventTickets,
        dateFeatures: this.createFeatureProfiles,
      };

      if (this.locationAction === LocationAction.create_location) {
        const createEventLocation: CreateEventLocationDTO = {
          eventId: publicEventLocation.eventId,
          eventCity: publicEventLocation.eventCity,
          eventState: publicEventLocation.eventState,
          eventCountry: publicEventLocation.eventCountry,
          eventLatitude: publicEventLocation.eventLatitude,
          eventLongitude: publicEventLocation.eventLongitude,
          eventTimeZone: publicEventLocation.eventTimeZone,
          eventDates: [createEventDate],
        };

        const profileDTO: ProfileDTO = {
          profile: Profiles.publicEventProfile,
          profileId: publicEventLocation.eventId,
        };

        this.store.dispatch(
          createPublicEventLocation({
            createEventLocation: createEventLocation,
            profileDTO: profileDTO,
          })
        );

        this.updateDisplayPanel.emit(LocationsDisplay.create_edit_location);
      }

      if (
        this.locationAction === LocationAction.edit_location &&
        this.locationDateAction === LocationDateAction.create_date
      ) {
        const eventComponent: EventComponentDTO = {
          component: EventComponents.event_location,
          componentId: publicEventLocation.locationId,
        };

        this.store.dispatch(
          createPublicEventDate({
            createEventDate: createEventDate,
            eventComponent: eventComponent,
          })
        );

        this.updateDisplayPanel.emit(LocationsDisplay.public_event_location);
      }
    }
  }

  private updatePublicEventLocations(): void {
    this.store.dispatch(
      setPublicEventDate({ publicEventDate: this.publicEventDate })
    );

    const locationDates = [...this.publicEventLocation.eventDates];
    const dateIndex: number = locationDates.findIndex(
      date => date.dateId === this.publicEventDate.dateId
    );
    locationDates[dateIndex] = this.publicEventDate;
    this.publicEventLocation = {
      ...this.publicEventLocation,
      eventDates: [...locationDates],
    };

    this.store.dispatch(
      setPublicEventLocation({ publicEventLocation: this.publicEventLocation })
    );

    const eventLocations = [...this.eventLocations];
    const locationIndex: number = eventLocations.findIndex(
      location => location.locationId === this.publicEventLocation.locationId
    );
    eventLocations[locationIndex] = this.publicEventLocation;

    this.store.dispatch(
      updateEventLocations({ eventLocations: eventLocations })
    );
  }
}
