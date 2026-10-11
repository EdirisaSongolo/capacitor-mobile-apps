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
import { Observable, Subscription } from 'rxjs';

import {
  ComponentAction,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { ProfileMapperService } from '@profile-accounts-core/services';
import {
  ProviderRequestDTO,
  LocationDTO,
  ProfileDTO,
} from '@app-core/app-api/app-api.dto-models';
import { EventDate } from '@domain-data-models/app-domain.interfaces';
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
import {
  retrieveServiceProvider,
  serviceProviderSelector,
} from '@profile-accounts-core/store';

import {
  PublicEventDateDTO,
  PublicEventLocationDTO,
} from '@public-events-core/api/public-events.dto-models';
import {
  locationDateActionSelector,
  publicEventActionSelector,
  publicEventDateSelector,
  publicEventLocationSelector,
} from '@public-events-core/store/create-edit-event/create-edit-event.selectors';
import {
  LocationDateAction,
  PublicEventAction,
} from '@public-events-core/data-models';
import { ProfileProcessorService } from '@profile-accounts-core/services/profile-processors/profile-processor.service';
import { LocationMappersService } from '@domain-services/mappers';

@Component({
  selector: 'Tsk-event-date-venue',
  templateUrl: './event-date-venue.component.html',
  styleUrls: ['./event-date-venue.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventDateVenueComponent implements OnInit, OnDestroy {
  @ViewChild('profile_booking')
  profileBookingDialog!: ElementRef<HTMLDivElement>;
  @Output() public eventDateVenue: EventEmitter<VenueTokenDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.event_management;
  public controlIcon: string = 'edit';
  public selectedVenue: boolean = false;

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
  public location: LocationDTO;
  public profileDTO: ProfileDTO;
  public bookingDates: EventDate[] = [];
  public profileBooking: boolean = false;

  private dateId: string;
  private publicEventAction: PublicEventAction;
  private locationDateAction: LocationDateAction;
  private publicEventDate: PublicEventDateDTO;

  private serviceProvider: ServiceProviderDTO;
  private serviceProvider$: Observable<ServiceProviderDTO> = this.store.select(
    serviceProviderSelector
  );
  private publicEventAction$: Observable<PublicEventAction> = this.store.select(
    publicEventActionSelector
  );
  private locationDateAction$: Observable<LocationDateAction> =
    this.store.select(locationDateActionSelector);
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
    private locationMappers: LocationMappersService,
    private profileMappers: ProfileMapperService,
    private profileProcessor: ProfileProcessorService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const publicEventActionSub = this.publicEventAction$.subscribe(
      eventAction => {
        this.publicEventAction = eventAction;
      }
    );

    this.subscriptions.add(publicEventActionSub);

    const locationDateActionSub = this.locationDateAction$.subscribe(
      dateAction => {
        this.locationDateAction = dateAction;
      }
    );

    this.subscriptions.add(locationDateActionSub);

    const publicEventLocationSub = this.publicEventLocation$.subscribe(
      publicEventLocation => {
        this.location =
          this.locationMappers.publicEventLocationDTO(publicEventLocation);
      }
    );

    this.subscriptions.add(publicEventLocationSub);

    const publicEventDateSub = this.publicEventDate$.subscribe(
      publicEventDate => {
        this.publicEventDate = { ...publicEventDate };
        this.dateVenue = this.publicEventDate?.dateVenue;
        if (this.dateVenue) {
          this.selectedVenue = true;
          const profileDTO: ProfileDTO = {
            profile: Profiles.venueProfile,
            profileId: this.dateVenue.venueProfileId,
          };
          this.store.dispatch(
            retrieveServiceProvider({ profileDTO: profileDTO })
          );
        }
      }
    );

    this.subscriptions.add(publicEventDateSub);

    const serviceProviderSub = this.serviceProvider$.subscribe(
      serviceProvider => {
        if (serviceProvider) {
          this.serviceProvider = { ...serviceProvider };
          this.setDateVenueDetails();
        }
      }
    );

    this.subscriptions.add(serviceProviderSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  public processServiceProvider(serviceProvider: ServiceProviderDTO): void {
    this.bookingAction = BookingAction.create;
    this.dateVenue = serviceProvider as VenueTokenDTO;
    this.profileDTO =
      this.profileMappers.serviceProviderToProfileDTO(serviceProvider);

    if (this.publicEventDate?.eventDate && this.publicEventDate?.startTime) {
      const profileDate: EventDate = {
        selected: false,
        referenceId: this.publicEventDate?.dateId,
        date: this.publicEventDate?.eventDate,
        startTime: this.publicEventDate?.startTime,
        endTime: this.publicEventDate?.endTime,
      };

      this.bookingDates = [profileDate];
    }
    this.profileBooking = true;
  }

  public setEventDateVenue(providerRequests: ProviderRequestDTO[]): void {
    let providerRequest: ProviderRequestDTO = providerRequests[0];

    if (this.publicEventAction === PublicEventAction.create_event) {
      this.eventDateVenue.emit(this.dateVenue);
    } else if (this.publicEventAction === PublicEventAction.edit_event) {
      if (this.locationDateAction === LocationDateAction.create_date) {
        this.eventDateVenue.emit(this.dateVenue);
      } else if (this.locationDateAction === LocationDateAction.edit_date) {
        providerRequest = { ...providerRequest, referenceId: this.dateId };

        // this.store.dispatch(
        //   createPublicEventFeature({ providerRequest: providerRequest })
        // );
      }
    }

    this.profileBooking = false;
    this.selectedVenue = true;
  }

  public editDateVenue(): void {
    this.selectedVenue = false;
  }

  private setDateVenueDetails(): void {
    const defaultProfileImage: string = VenuesConstants.DEFAULT_PROFILE_IMAGE;

    const venueTokenDTO = this.serviceProvider as VenueTokenDTO;
    this.venueDetails.profileName = venueTokenDTO.venueName;

    const profileImagePath = this.serviceProvider?.profileImage
      ? this.serviceProvider.profileImage
      : defaultProfileImage;
    this.venueDetails.profileImage = `url(${profileImagePath}) center/ contain no-repeat`;

    const profileLocation: LocationDTO = this.serviceProvider.profileLocation;
    this.venueDetails.profileLocation = `${profileLocation.city}, ${profileLocation.state}`;

    const businessProfile: BusinessProfileDTO =
      this.serviceProvider.businessProfile;
    const businessProfileDetails: BusinessProfileDetails =
      this.profileProcessor.processBusinessProfile(businessProfile);

    this.venueDetails = { ...this.venueDetails, ...businessProfileDetails };
  }
}
