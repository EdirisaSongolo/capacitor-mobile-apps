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
import { Store } from '@ngrx/store';
import tzLookup from '@photostructure/tz-lookup';
import { FormBuilder, Validators } from '@angular/forms';
import { forkJoin, Observable, Subscription } from 'rxjs';

import {
  AppResponseType,
  ComponentAction,
  Device,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { GeoLocationService } from '@domain-services/geo-location-api/geo-location.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { ProfileMapperService } from '@profile-accounts-core/services';
import {
  ProviderRequestDTO,
  LocationDTO,
  ProfileDTO,
} from '@app-core/app-api/app-api.dto-models';
import {
  EventDate,
  LocationDetails,
} from '@domain-data-models/app-domain.interfaces';
import { VenueTokenDTO } from '@venues-core/api/venues.dto-models';
import {
  BookingAction,
  BusinessProfileDetails,
  ProviderDetails,
} from '@profile-accounts-core/data-models';
import {
  BusinessProfileDTO,
  ServiceProviderDTO,
} from '@profile-accounts-core/api';
import { VenuesConstants } from '@venues-core/data-models';
import { serviceProviderSelector } from '@profile-accounts-core/store';
import {
  PrivateEventAction,
  VenueType,
} from '@private-events-core/data-models';
import {
  privateEventDateSelector,
  privateEventLocationSelector,
  privateEventStartTimeSelector,
  privateEventEndTimeSelector,
  privateEventActionSelector,
  updatePrivateEventLocation,
} from '@private-events-core/store/create-edit-event';
import {
  PrivateEventLocationDTO,
  PrivateEventVenueDTO,
} from '@private-events-core/api';
import { ProfileProcessorService } from '@profile-accounts-core/services/profile-processors/profile-processor.service';
import { LocationMappersService } from '@domain-services/mappers';

enum DateVenueDisplays {
  public_venue = 'PUBLIC_VENUE',
  private_address = 'PRIVATE_ADDRESS',
  location_address = 'LOCATION_ADDRESS',
  venue_search = 'VENUE_SEARCH',
}

@Component({
  selector: 'Tsk-event-venue',
  templateUrl: './event-venue.component.html',
  styleUrls: ['./event-venue.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventVenueComponent implements OnInit, OnDestroy {
  @ViewChild('profile_booking')
  profileBookingDialog!: ElementRef<HTMLDivElement>;
  @Output() public eventDateVenue: EventEmitter<VenueTokenDTO> =
    new EventEmitter();
  @Output() public eventPrivateAddress: EventEmitter<LocationDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayPanel: DateVenueDisplays = DateVenueDisplays.location_address;
  public panelOptions: typeof DateVenueDisplays = DateVenueDisplays;

  public componentAction: ComponentAction = ComponentAction.event_management;
  public controlIcon: string = 'edit';
  public selectedVenue: boolean = false;

  public locationDisplay: string;
  public locationDTO: LocationDTO;
  public privateAddress: string;
  public possibleAddresses: Observable<string[]>;
  public addressForm = this.formBuilder.group({
    addressInput: ['', Validators.required],
  });
  public dateVenue: VenueTokenDTO;
  public profileImage: string;
  public venueDetails: ProviderDetails = {
    profileImage: null,
    profileName: null,
    businessCategory: null,
    profileLocation: null,
    profileBaseRate: 0,
    profileRateUnits: null,
    profileServices: [],
    profileStatus: null,
  };
  public bookingAction: BookingAction;
  public profileDTO: ProfileDTO;
  public bookingDates: EventDate[] = [];
  public profileBooking: boolean = false;

  private privateEventAction: PrivateEventAction;
  private eventLocation: PrivateEventLocationDTO;
  private startTime: string;
  private endTime: string;
  private eventDate: string;
  private bookingDate: EventDate = {} as EventDate;
  private serviceProvider: ServiceProviderDTO;

  private privateEventAction$: Observable<PrivateEventAction> =
    this.store.select(privateEventActionSelector);
  private privateEventLocation$: Observable<PrivateEventLocationDTO> =
    this.store.select(privateEventLocationSelector);
  private startTime$: Observable<string> = this.store.select(
    privateEventStartTimeSelector
  );
  private endTime$: Observable<string> = this.store.select(
    privateEventEndTimeSelector
  );
  private eventDate$: Observable<string> = this.store.select(
    privateEventDateSelector
  );
  private serviceProvider$: Observable<ServiceProviderDTO> = this.store.select(
    serviceProviderSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private geoLocationService: GeoLocationService,
    private locationMappers: LocationMappersService,
    private profileMappers: ProfileMapperService,
    private profileProcessor: ProfileProcessorService,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const privateEventActionSub = this.privateEventAction$.subscribe(
      privateEvent => (this.privateEventAction = privateEvent)
    );

    this.subscriptions.add(privateEventActionSub);

    const eventLocationSub = this.privateEventLocation$.subscribe(
      eventLocation => {
        this.eventLocation = eventLocation;
        this.processEventLocationVenue(this.eventLocation);
        this.locationDTO = this.locationMappers.privateEventLocationDTO(
          this.eventLocation
        );
        this.locationDisplay = `${this.locationDTO.city}, ${this.locationDTO.state}`;
      }
    );

    this.subscriptions.add(eventLocationSub);

    const addressInputSub = this.addressForm
      .get('addressInput')
      ?.valueChanges.subscribe(userInput => {
        if (userInput) {
          this.possibleAddresses =
            this.geoLocationService.locationAutoCompleteSuggestions(userInput);
        }
      });

    this.subscriptions.add(addressInputSub);

    const timeDateSub = forkJoin([
      this.startTime$,
      this.endTime$,
      this.eventDate$,
    ]).subscribe(([startTime, endTime, eventDate]) => {
      if (startTime && endTime && eventDate) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.eventDate = eventDate;
        this.bookingDate = {
          selected: false,
          date: this.eventDate,
          startTime: this.startTime,
          endTime: this.endTime,
        };
        this.bookingDates = [this.bookingDate];
      }
    });

    this.subscriptions.add(timeDateSub);

    const serviceProviderSub = this.serviceProvider$.subscribe(
      serviceProvider => {
        if (serviceProvider) {
          this.serviceProvider = { ...serviceProvider };
          this.setPublicVenueDetails(this.serviceProvider);
        }
      }
    );

    this.subscriptions.add(serviceProviderSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public editDateVenue(): void {
    this.displayPanel = this.panelOptions.location_address;
  }

  public componentClickEvent(event: MouseEvent): void {
    const bookingClick = this.profileBookingDialog?.nativeElement.contains(
      event.target as Node
    );

    if (!bookingClick) {
      this.closeDialog();
    }
  }

  public closeDialog(): void {
    if (this.profileBooking) {
      this.profileBooking = false;
    }
  }

  public displayVenueSearch(): void {
    this.displayPanel = this.panelOptions.venue_search;
  }

  public processServiceProvider(serviceProvider: ServiceProviderDTO): void {
    this.bookingAction = BookingAction.create;
    this.dateVenue = serviceProvider as VenueTokenDTO;
    this.profileDTO =
      this.profileMappers.serviceProviderToProfileDTO(serviceProvider);

    this.profileBooking = true;
  }

  public setEventDateVenue(providerRequests: ProviderRequestDTO[]): void {
    if (this.privateEventAction === PrivateEventAction.create_event) {
      this.eventDateVenue.emit(this.dateVenue);
    } else if (this.privateEventAction === PrivateEventAction.edit_event) {
      const venueLocation: LocationDTO = this.dateVenue.venueLocation;
      const eventLocation: PrivateEventLocationDTO = {
        ...this.eventLocation,
        eventVenue: {
          venueType: VenueType.public_venue,
          publicVenue: this.dateVenue,
        },
        eventCity: venueLocation.city,
        eventState: venueLocation.state,
        eventCountry: venueLocation.country,
        eventLatitude: venueLocation.latitude,
        eventLongitude: venueLocation.longitude,
        eventTimeZone: tzLookup(
          venueLocation.latitude,
          venueLocation.longitude
        ),
      };

      this.store.dispatch(
        updatePrivateEventLocation({ eventLocation: eventLocation })
      );
    }

    const venueLocation = this.dateVenue.venueLocation;
    this.locationDisplay = `${venueLocation.city}, ${venueLocation.state}`;
    this.profileBooking = false;
    this.displayPanel = DateVenueDisplays.public_venue;
  }

  public async setPrivateAddress(): Promise<void> {
    const addressInput: string = this.addressForm.get('addressInput').value;
    const locationDetails: LocationDetails =
      await this.geoLocationService.retrieveGeoLocationData(addressInput);
    const locationDTO: LocationDTO =
      this.locationMappers.createPrivateEventAddress(locationDetails);

    if (!locationDTO) {
      const messages: string[] = ['common-errors.unresolved-address'];
      this.appResponseService.createAppResponse(
        AppResponseType.error,
        messages
      );
      return;
    }

    this.locationDisplay = `${locationDTO.city}, ${locationDTO.state}`;
    if (this.privateEventAction === PrivateEventAction.create_event) {
      this.eventPrivateAddress.emit(locationDTO);
    } else if (this.privateEventAction === PrivateEventAction.edit_event) {
      const eventLocation: PrivateEventLocationDTO = {
        ...this.eventLocation,
        eventVenue: {
          venueType: VenueType.private_venue,
          privateAddress: locationDTO.address,
        },
        eventCity: locationDTO.city,
        eventState: locationDTO.state,
        eventCountry: locationDTO.country,
        eventLatitude: locationDTO.latitude,
        eventLongitude: locationDTO.longitude,
        eventTimeZone: locationDTO.timeZone,
      };

      this.store.dispatch(
        updatePrivateEventLocation({ eventLocation: eventLocation })
      );
    }
  }

  private processEventLocationVenue(
    privateEventLocation: PrivateEventLocationDTO
  ): void {
    const eventVenue: PrivateEventVenueDTO = privateEventLocation.eventVenue;
    if (eventVenue?.venueType === VenueType.private_venue) {
      this.displayPanel = DateVenueDisplays.private_address;
      this.privateAddress = eventVenue.privateAddress;
    } else if (eventVenue?.venueType === VenueType.public_venue) {
      this.displayPanel = DateVenueDisplays.public_venue;
      this.serviceProvider = { ...eventVenue.publicVenue };
      this.setPublicVenueDetails(this.serviceProvider);
    }
  }

  private setPublicVenueDetails(serviceProvider: ServiceProviderDTO): void {
    const defaultProfileImage: string = VenuesConstants.DEFAULT_PROFILE_IMAGE;

    const venueTokenDTO = serviceProvider as VenueTokenDTO;
    this.venueDetails.profileName = venueTokenDTO.venueName;

    const profileImagePath = serviceProvider?.profileImage
      ? serviceProvider.profileImage
      : defaultProfileImage;
    this.venueDetails.profileImage = `url(${profileImagePath}) center/ contain no-repeat`;

    const profileLocation: LocationDTO = serviceProvider.profileLocation;
    this.venueDetails.profileLocation = `${profileLocation.city}, ${profileLocation.state}`;

    const businessProfile: BusinessProfileDTO =
      this.serviceProvider.businessProfile;
    const businessProfileDetails: BusinessProfileDetails =
      this.profileProcessor.processBusinessProfile(businessProfile);

    this.venueDetails = { ...this.venueDetails, ...businessProfileDetails };
  }
}
