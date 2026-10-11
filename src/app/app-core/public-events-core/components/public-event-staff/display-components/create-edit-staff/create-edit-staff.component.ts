import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ApiCallIndicatorService,
  ProviderRequestDTO,
  LocationDTO,
  ProfileDTO,
} from '@app-core/app-api';
import {
  DateTokenDTO,
  EventComponentDTO,
  EventProviderDTO,
  PublicEventDateDTO,
  PublicEventLocationDTO,
} from '@app-core/public-events-core/api';
import { VendorTokenDTO } from '@app-core/vendors-core/api';

import {
  AppResponseType,
  ComponentAction,
  Device,
  Profiles,
  RequestStatus,
} from '@domain-data-models/app-domain.enums';

import { EventDate } from '@domain-data-models/app-domain.interfaces';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { BreakPointService } from '@domain-services/index';
import { LocationMappersService } from '@domain-services/mappers';
import { Store } from '@ngrx/store';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import {
  BookingAction,
  ServiceProviderDomains,
} from '@profile-accounts-core/data-models';
import { ProfileMapperService } from '@profile-accounts-core/services';
import {
  EventComponents,
  PublicEventAction,
} from '@public-events-core/data-models';
import { PublicEventMappersService } from '@public-events-core/services';
import {
  createPublicEventStaff,
  publicEventProfileImageSelector,
  publicEventActionSelector,
  publicEventLocationSelector,
  retrieveStaffLocationDates,
  retrievePublicEventLocation,
  staffLocationDatesSelector,
  updatePublicEventStaff,
} from '@public-events-core/store';
import { UserTokenDTO } from '@user-profile-core/api';
import {
  filter,
  firstValueFrom,
  Observable,
  skip,
  Subject,
  Subscription,
} from 'rxjs';

enum EventStaffDisplay {
  location_staff = 'LOCATION_STAFF',
  service_providers = 'SERVICE_PROVIDERS',
}

@Component({
  selector: 'Tsk-create-edit-staff',
  templateUrl: './create-edit-staff.component.html',
  styleUrls: ['./create-edit-staff.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreateEditStaffComponent implements OnInit {
  @ViewChild('profile_booking')
  profileBookingDialog!: ElementRef<HTMLDivElement>;
  @Output() public appendStaffProfile: EventEmitter<ProviderRequestDTO[]> =
    new EventEmitter();
  @Output() public updateStaffProfile: EventEmitter<ProviderRequestDTO[]> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public staffDisplay: EventStaffDisplay = EventStaffDisplay.location_staff;
  public controlIcon: string =
    this.staffDisplay === EventStaffDisplay.location_staff ? 'add' : 'notes';
  public displayOptions: typeof EventStaffDisplay = EventStaffDisplay;

  public profileOptions: typeof Profiles = Profiles;
  public serviceProviderDomain: ServiceProviderDomains =
    ServiceProviderDomains.staff_profiles;
  public location: LocationDTO;

  public componentAction: ComponentAction = ComponentAction.event_management;
  public publicEventLocation: PublicEventLocationDTO;
  public locationStaff: ServiceProviderDTO[] = [];
  public profileImage: string | File;
  public locationDatesTokens: DateTokenDTO[] = [];

  public bookingAction: BookingAction;
  public profileDTO: ProfileDTO;
  public bookingDates: EventDate[] = [];
  public profileBooking: boolean = false;

  public staffLocationDates: DateTokenDTO[] = [];

  private eventLocation: EventComponentDTO;

  private publicEventAction: PublicEventAction;
  private locationDates: Subject<PublicEventDateDTO[]> = new Subject();
  private locationDates$: Observable<PublicEventDateDTO[]> =
    this.locationDates.asObservable();
  private eventAction$: Observable<PublicEventAction> = this.store.select(
    publicEventActionSelector
  );
  private profileImage$: Observable<string | File> = this.store.select(
    publicEventProfileImageSelector
  );
  private staffLocationDates$: Observable<DateTokenDTO[]> = this.store.select(
    staffLocationDatesSelector
  );
  private publicEventLocation$: Observable<PublicEventLocationDTO> =
    this.store.select(publicEventLocationSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store<any>,
    public publicEventMappers: PublicEventMappersService,
    private locationMappers: LocationMappersService,
    private profileMapperService: ProfileMapperService,
    private appResponseService: AppResponseService,
    private apiCallIndicator: ApiCallIndicatorService
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
        this.location = this.locationMappers.publicEventLocationDTO(
          this.publicEventLocation
        );

        if (this.publicEventLocation.eventDates) {
          const locationDates = [...this.publicEventLocation.eventDates];
          this.locationDates.next(locationDates);
          this.locationDatesTokens = locationDates.flatMap(date =>
            this.publicEventMappers.dateTokenDTOMapper(date)
          );
        }
      }
    );

    this.subscriptions.add(publicEventLocationSub);

    const eventActionSub = this.eventAction$.subscribe(eventAction => {
      this.publicEventAction = eventAction;

      if (
        this.publicEventAction &&
        this.publicEventAction === PublicEventAction.edit_event
      ) {
        this.eventLocation = {
          component: EventComponents.event_location,
          componentId: this.publicEventLocation.locationId,
        };

        this.store.dispatch(
          retrievePublicEventLocation({ eventComponent: this.eventLocation })
        );
      }
    });

    this.subscriptions.add(eventActionSub);

    const locationDatesSub = this.locationDates$.subscribe(locationDates => {
      if (locationDates) {
        this.processLocationDates(locationDates);
      }
    });

    this.subscriptions.add(locationDatesSub);

    const staffLocationDatesSub = this.staffLocationDates$.subscribe(
      staffLocationDates => (this.staffLocationDates = [...staffLocationDates])
    );

    this.subscriptions.add(staffLocationDatesSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public asUserToken(staff: ServiceProviderDTO) {
    return staff as UserTokenDTO;
  }

  public asVendorToken(staff: ServiceProviderDTO) {
    return staff as VendorTokenDTO;
  }

  public updateDisplayPanel(): void {
    if (this.staffDisplay === this.displayOptions.location_staff) {
      this.staffDisplay = this.displayOptions.service_providers;
      this.controlIcon = 'notes';
    } else if (this.staffDisplay === this.displayOptions.service_providers) {
      this.staffDisplay = this.displayOptions.location_staff;
      this.controlIcon = 'add';
    }
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

  public async processServiceProvider(
    serviceProvider: ServiceProviderDTO
  ): Promise<void> {
    this.bookingAction = BookingAction.create;
    this.profileDTO =
      this.profileMapperService.serviceProviderToProfileDTO(serviceProvider);

    const duplicate = this.validateServiceProvider();

    if (duplicate) {
      const duplicateStaffer: string =
        'create-event.public-event.staff.duplicate-staff';
      this.appResponseService.createAppResponse(AppResponseType.error, [
        duplicateStaffer,
      ]);
      return;
    }

    this.bookingDates = this.processEventLocationDates();
    this.profileBooking = true;
  }

  public createEventStaffProfiles(
    providerRequests: ProviderRequestDTO[]
  ): void {
    if (this.publicEventAction === PublicEventAction.create_event) {
      this.appendStaffProfile.emit(providerRequests);
    } else if (this.publicEventAction === PublicEventAction.edit_event) {
      this.store.dispatch(
        createPublicEventStaff({
          providerRequests: providerRequests,
          eventLocation: this.eventLocation,
        })
      );
    }

    this.profileBooking = false;
  }

  public async processEventStaffProfile(
    serviceProvider: ServiceProviderDTO
  ): Promise<void> {
    this.bookingAction = BookingAction.update;
    this.profileDTO =
      this.profileMapperService.serviceProviderToProfileDTO(serviceProvider);

    if (this.publicEventAction === PublicEventAction.create_event) {
      this.bookingDates = this.processCreateStaffDates(this.profileDTO);
    } else if (this.publicEventAction === PublicEventAction.edit_event) {
      await this.retrieveStaffLocationDates(this.profileDTO);
      this.bookingDates = this.processStaffLocationDates(
        this.staffLocationDates
      );
    }

    this.profileBooking = true;
  }

  public updateEventStaffProfiles(
    providerRequests: ProviderRequestDTO[]
  ): void {
    if (this.publicEventAction === PublicEventAction.create_event) {
      const staffDates = this.processCreateStaffDates(this.profileDTO);
      const requestUpdates = this.processProviderRequestsUpdates(
        staffDates,
        providerRequests
      );

      if (requestUpdates.length === 0) {
        const duplicateStaffer: string =
          'create-event.public-event.staff.no-changes';
        this.appResponseService.createAppResponse(AppResponseType.warning, [
          duplicateStaffer,
        ]);
        return;
      }

      this.updateStaffProfile.emit(requestUpdates);
    } else if (this.publicEventAction === PublicEventAction.edit_event) {
      const staffDates = this.processStaffLocationDates(
        this.staffLocationDates
      );
      const requestUpdates = this.processProviderRequestsUpdates(
        staffDates,
        providerRequests
      );

      if (requestUpdates.length === 0) {
        const duplicateStaffer: string =
          'create-event.public-event.staff.no-changes';
        this.appResponseService.createAppResponse(AppResponseType.warning, [
          duplicateStaffer,
        ]);
        return;
      }

      this.store.dispatch(
        updatePublicEventStaff({
          providerRequests: requestUpdates,
          eventLocation: this.eventLocation,
        })
      );
    }

    this.profileBooking = false;
  }

  private processLocationDates(locationDates: PublicEventDateDTO[]): void {
    const profileIds: string[] = [];
    const locationStaff: ServiceProviderDTO[] = [];

    for (const locationDate of locationDates) {
      const dateStaff = locationDate.dateStaff;
      dateStaff.forEach(staffProfile => {
        const profileDTO =
          this.profileMapperService.serviceProviderToProfileDTO(staffProfile);
        const profileId = profileDTO.profileId;

        if (!profileIds.includes(profileId)) {
          locationStaff.push(staffProfile);
          profileIds.push(profileId);
        }
      });
    }

    this.locationStaff = [...locationStaff];
  }

  private validateServiceProvider(): boolean {
    return this.locationStaff.some(staffProfile => {
      const provider =
        this.profileMapperService.serviceProviderToProfileDTO(staffProfile);
      return (
        provider.profile === this.profileDTO.profile &&
        provider.profileId === this.profileDTO.profileId
      );
    });
  }

  private processEventLocationDates(): EventDate[] {
    const profileDates: EventDate[] = [];
    const locationDates = this.publicEventLocation.eventDates;

    for (const locationDate of locationDates) {
      const profileDate: EventDate = {
        selected: false,
        referenceId: locationDate.dateId,
        date: locationDate.eventDate,
        startTime: locationDate.startTime,
        endTime: locationDate.endTime,
      };

      profileDates.push(profileDate);
    }

    return profileDates;
  }

  private processCreateStaffDates(profileDTO: ProfileDTO): EventDate[] {
    const profileDates: EventDate[] = [];
    const locationDates = this.publicEventLocation.eventDates;

    for (const locationDate of locationDates) {
      let selected = false;
      const dateStaff = locationDate.dateStaff;
      dateStaff.forEach(provider => {
        let providerId: string;
        if (provider.profile === Profiles.userProfile) {
          const providerDTO = provider as UserTokenDTO;
          providerId = providerDTO.userProfileId;
        } else if (provider.profile === Profiles.vendorProfile) {
          const providerDTO = provider as VendorTokenDTO;
          providerId = providerDTO.vendorProfileId;
        }

        if (
          provider.profile === profileDTO.profile &&
          providerId === profileDTO.profileId
        )
          selected = true;
      });

      const profileDate: EventDate = {
        selected: selected,
        referenceId: locationDate.dateId,
        date: locationDate.eventDate,
        startTime: locationDate.startTime,
        endTime: locationDate.endTime,
      };

      profileDates.push(profileDate);
    }

    return profileDates;
  }

  private async retrieveStaffLocationDates(
    profileDTO: ProfileDTO
  ): Promise<void> {
    const eventProvider: EventProviderDTO = {
      component: EventComponents.event_location,
      componentId: this.publicEventLocation.locationId,
      profileDTO: profileDTO,
    };

    this.store.dispatch(
      retrieveStaffLocationDates({ eventProvider: eventProvider })
    );

    await firstValueFrom(
      this.apiCallIndicator.apiCallInProgress$.pipe(
        skip(1),
        filter(inprogress => !inprogress)
      )
    );
  }

  private processStaffLocationDates(
    staffLocationDates: DateTokenDTO[]
  ): EventDate[] {
    const profileDates: EventDate[] = [];
    const profileDateIds = staffLocationDates.map(date => date.dateId);
    this.locationDatesTokens.forEach(locationDate => {
      const duplicate = profileDateIds.includes(locationDate.dateId);

      const profileDate: EventDate = {
        selected: duplicate,
        referenceId: locationDate.dateId,
        date: locationDate.eventDate,
        startTime: locationDate.startTime,
        endTime: locationDate.endTime,
      };

      profileDates.push(profileDate);
    });

    return profileDates;
  }

  private processProviderRequestsUpdates(
    staffDates: EventDate[],
    providerRequests: ProviderRequestDTO[]
  ): ProviderRequestDTO[] {
    const requestUpdates: ProviderRequestDTO[] = [];
    const locationDatesIds = this.publicEventLocation.eventDates.map(
      date => date.dateId
    );
    const bookedDates = staffDates.filter(date => date.selected);
    const staffDatesIds = bookedDates.map(date => date.referenceId);
    const requestsDatesIds = providerRequests.map(
      request => request.referenceId
    );

    for (const locationDateId of locationDatesIds) {
      const staffed = staffDatesIds.includes(locationDateId);
      const requested = requestsDatesIds.includes(locationDateId);

      if (staffed && requested) continue;

      if (staffed && !requested) {
        const update: ProviderRequestDTO = {
          referenceId: locationDateId,
          provider: this.profileDTO,
          requestStatus: RequestStatus.cancelled,
        };

        requestUpdates.push(update);
      }

      if (!staffed && requested) {
        const update: ProviderRequestDTO = {
          referenceId: locationDateId,
          provider: this.profileDTO,
          requestStatus: RequestStatus.pending,
        };

        requestUpdates.push(update);
      }
    }

    return requestUpdates;
  }
}
