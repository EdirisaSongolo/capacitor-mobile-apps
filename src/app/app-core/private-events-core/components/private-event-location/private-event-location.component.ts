import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import tzLookup from '@photostructure/tz-lookup';

import { BreakPointService } from '@domain-services/index';
import { Device } from '@domain-data-models/app-domain.enums';
import { GeoLocationService } from '@domain-services/geo-location-api/geo-location.service';
import { profileDTOSelector } from '@app-domain/store';
import {
  LocationDTO,
  ProfileDTO,
  ProviderRequestDTO,
} from '@app-core/app-api/app-api.dto-models';
import { VenueTokenDTO } from '@app-core/venues-core/api';
import {
  setPrivateEventLocation,
  privateEventLocationSelector,
  privateEventActionSelector,
  privateEventFeaturesSelector,
  updatePrivateEventFeatures,
  setPrivateEventTime,
  setPrivateEventDate,
  updatePrivateEventDisplayPanel,
  setDateTimeAction,
  retrievePrivateEventLocation,
  setPrivateEventHost,
} from '@app-core/private-events-core/store/create-edit-event';
import {
  CreatePrivateEventPanel,
  DateTimeAction,
  PrivateEventAction,
  VenueType,
} from '@private-events-core/data-models';
import {
  PrivateEventLocationDTO,
  PrivateEventVenueDTO,
} from '@private-events-core/api';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import { ProfileMapperService } from '@profile-accounts-core/services';
import { LocationMappersService } from '@domain-services/mappers';

enum LocationDisplay {
  event_location = 'EVENT_LOCATION',
  event_date = 'EVENT_DATE',
}

interface Indicator {
  position: string;
  index: number;
}

@Component({
  selector: 'Tsk-private-event-location',
  templateUrl: './private-event-location.component.html',
  styleUrls: ['./private-event-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivateEventLocationComponent implements OnInit, OnDestroy {
  @ViewChild('date_panels') set datePanelsElem(
    element: ElementRef<HTMLDivElement> | undefined
  ) {
    if (element) {
      this.datePanels = element;
      const panelsContainer = element.nativeElement;
      const panelWidth = panelsContainer.clientWidth;
      panelsContainer.scrollTo({
        left: panelWidth,
        behavior: 'auto',
      });
    }
  }

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public datePanels?: ElementRef<HTMLDivElement>;

  public locationDisplay: LocationDisplay = LocationDisplay.event_location;
  public displayOptions: typeof LocationDisplay = LocationDisplay;

  public locationsForm: boolean = false;
  public possibleLocations: Observable<string[]>;
  public locationForm = this.formBuilder.group({
    locationInput: ['', Validators.required],
  });

  public panel: string = 'center';
  public indicators: Indicator[] = [
    { position: 'left', index: 0 },
    { position: 'center', index: 800 },
    { position: 'right', index: 1600 },
  ];

  private privateEventAction: PrivateEventAction;
  private profileDTO: ProfileDTO;
  private eventLocation: PrivateEventLocationDTO;
  private locationInput: string;
  private eventFeatures: ServiceProviderDTO[] = [];

  private eventFeatures$: Observable<ServiceProviderDTO[]> = this.store.select(
    privateEventFeaturesSelector
  );
  private eventLocation$: Observable<PrivateEventLocationDTO> =
    this.store.select(privateEventLocationSelector);
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private privateEventAction$: Observable<PrivateEventAction> =
    this.store.select(privateEventActionSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private geoLocation: GeoLocationService,
    private locationMappers: LocationMappersService,
    private profileMappers: ProfileMapperService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
      }
    });

    this.subscriptions.add(profileDTOSub);

    const privateEventActionSub = this.privateEventAction$.subscribe(
      privateEventAction => {
        this.privateEventAction = privateEventAction;
        if (this.privateEventAction === PrivateEventAction.edit_event) {
          this.store.dispatch(
            retrievePrivateEventLocation({ profileDTO: this.profileDTO })
          );
        }
      }
    );

    this.subscriptions.add(privateEventActionSub);

    const eventLocationSub = this.eventLocation$.subscribe(eventLocation => {
      this.eventLocation = eventLocation;
      if (
        this.eventLocation?.eventLatitude &&
        this.eventLocation?.eventLongitude
      ) {
        this.locationDisplay = LocationDisplay.event_date;
        this.store.dispatch(
          setDateTimeAction({ dateTimeAction: DateTimeAction.edit_date })
        );
      }
    });

    this.subscriptions.add(eventLocationSub);

    const eventFeaturesSub = this.eventFeatures$.subscribe(
      eventFeatures => (this.eventFeatures = [...eventFeatures])
    );

    this.subscriptions.add(eventFeaturesSub);

    this.subscribeToFormsChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async setEventLocation(): Promise<void> {
    const locationDetails = await this.geoLocation.retrieveGeoLocationData(
      this.locationInput
    );

    const locationDTO: LocationDTO =
      this.locationMappers.createLocationDTO(locationDetails);

    const eventLocation: PrivateEventLocationDTO = {
      eventVenue: null,
      eventCity: locationDTO.city,
      eventState: locationDTO.state,
      eventCountry: locationDTO.country,
      eventLatitude: locationDTO.latitude,
      eventLongitude: locationDTO.longitude,
      eventTimeZone: locationDTO.timeZone,
    };

    this.store.dispatch(
      setPrivateEventLocation({ eventLocation: eventLocation })
    );

    this.store.dispatch(
      setDateTimeAction({ dateTimeAction: DateTimeAction.create_date })
    );

    this.locationDisplay = this.displayOptions.event_date;
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
    const eventVenue: PrivateEventVenueDTO = {
      venueType: VenueType.public_venue,
      publicVenue: venue,
    };

    const venueLocation: LocationDTO = venue.venueLocation;
    this.eventLocation = {
      ...this.eventLocation,
      eventVenue: eventVenue,
      eventCity: venueLocation.city,
      eventState: venueLocation.state,
      eventCountry: venueLocation.country,
      eventLatitude: venueLocation.latitude,
      eventLongitude: venueLocation.longitude,
      eventTimeZone: tzLookup(venueLocation.latitude, venueLocation.longitude),
    };

    this.store.dispatch(
      setPrivateEventLocation({ eventLocation: this.eventLocation })
    );
  }

  public setEventPrivateAddress(locationDTO: LocationDTO): void {
    const eventVenue: PrivateEventVenueDTO = {
      venueType: VenueType.private_venue,
      privateAddress: locationDTO.address,
    };

    this.eventLocation = {
      ...this.eventLocation,
      eventVenue: eventVenue,
      eventCity: locationDTO.city,
      eventState: locationDTO.state,
      eventCountry: locationDTO.country,
      eventLatitude: locationDTO.latitude,
      eventLongitude: locationDTO.longitude,
      eventTimeZone: locationDTO.timeZone,
    };

    this.store.dispatch(
      setPrivateEventLocation({ eventLocation: this.eventLocation })
    );
  }

  public appendDateFeatureProfile(providerRequest: ProviderRequestDTO): void {
    const provider: ProfileDTO = providerRequest.provider;
    const serviceProvider: ServiceProviderDTO =
      this.profileMappers.profileToServiceProviderDTO(provider);

    this.eventFeatures.push(serviceProvider);
    this.store.dispatch(
      updatePrivateEventFeatures({ eventFeatures: this.eventFeatures })
    );
  }

  public removeDateFeatureProfile(providerRequest: ProviderRequestDTO): void {
    const features = this.eventFeatures;
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

    this.eventFeatures = [...serviceProviders];
    this.store.dispatch(
      updatePrivateEventFeatures({ eventFeatures: this.eventFeatures })
    );
  }

  public createEventDate(dateDetails: any): void {
    this.store.dispatch(
      setPrivateEventHost({ eventHost: dateDetails.eventHost })
    );

    this.store.dispatch(
      setPrivateEventTime({
        startTime: dateDetails.startTime,
        endTime: dateDetails.endTime,
      })
    );

    this.store.dispatch(
      setPrivateEventDate({ eventDate: dateDetails.eventDate })
    );

    if (this.privateEventAction === PrivateEventAction.create_event) {
      this.store.dispatch(
        updatePrivateEventDisplayPanel({
          displayPanel: CreatePrivateEventPanel.event_staff,
        })
      );
    }
  }

  private subscribeToFormsChanges(): void {
    this.locationForm
      .get('locationInput')
      ?.valueChanges.subscribe(userInput => {
        this.locationInput = userInput as string;
        this.possibleLocations =
          this.geoLocation.locationAutoCompleteSuggestions(this.locationInput);
      });
  }
}
