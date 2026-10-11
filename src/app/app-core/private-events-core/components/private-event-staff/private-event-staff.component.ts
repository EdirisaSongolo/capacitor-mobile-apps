import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Observable, Subscription, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';

import { BreakPointService } from '@domain-services/index';
import {
  AppResponseType,
  ComponentAction,
  Device,
  Profiles,
  RequestStatus,
} from '@domain-data-models/app-domain.enums';

import {
  updatePrivateEventStaff,
  privateEventLocationSelector,
  privateEventStaffSelector,
  privateEventActionSelector,
  privateEventStartTimeSelector,
  privateEventEndTimeSelector,
  privateEventDateSelector,
  retrievePrivateEventStaff,
  retrievePrivateEventLocation,
  createPrivateEventStaff,
  cancelPrivateEventStaff,
} from '@app-core/private-events-core/store/create-edit-event';

import { PrivateEventLocationDTO } from '@private-events-core/api';
import { ServiceProviderDTO } from '@profile-accounts-core/api/profile-accounts.dto-models';
import { VendorTokenDTO } from '@vendors-core/api/vendors.dto-models';
import { UserTokenDTO } from '@user-profile-core/api/user-profile.dto-models';

import {
  LocationDTO,
  ProfileDTO,
  ProviderRequestDTO,
} from '@app-core/app-api/app-api.dto-models';

import {
  BookingAction,
  ServiceProviderDomains,
} from '@profile-accounts-core/data-models';

import { ProfileMapperService } from '@profile-accounts-core/services';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';

import { PrivateEventAction } from '@private-events-core/data-models';
import { EventDate } from '@domain-data-models/app-domain.interfaces';
import { profileDTOSelector } from '@app-domain/store';
import { LocationMappersService } from '@domain-services/mappers';

enum EventStaffDisplay {
  no_location = 'NO_LOCATION',
  staff_list = 'STAFF_LIST',
  service_providers = 'SERVICE_PROVIDERS',
}

@Component({
  selector: 'Tsk-private-event-staff',
  templateUrl: './private-event-staff.component.html',
  styleUrls: ['./private-event-staff.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivateEventStaffComponent implements OnInit, OnDestroy {
  @ViewChild('profile_booking')
  profileBookingDialog!: ElementRef<HTMLDivElement>;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public staffDisplay: EventStaffDisplay = EventStaffDisplay.no_location;
  public displayOptions: typeof EventStaffDisplay = EventStaffDisplay;

  public controlIcon: string =
    this.staffDisplay === EventStaffDisplay.service_providers ? 'notes' : 'add';

  public profileOptions: typeof Profiles = Profiles;
  public serviceProviderDomain: ServiceProviderDomains =
    ServiceProviderDomains.staff_profiles;
  public locationDTO: LocationDTO;

  public componentAction: ComponentAction = ComponentAction.event_management;
  public eventStaff: ServiceProviderDTO[] = [];
  public profileImage: string | File;

  public bookingAction: BookingAction;
  public serviceProvider: ProfileDTO;
  public bookingDates: EventDate[] = [];
  public profileBooking: boolean = false;

  private privateEventAction: PrivateEventAction;
  private privateEventLocation: PrivateEventLocationDTO;
  private startTime: string;
  private endTime: string;
  private eventDate: string;
  private bookingDate: EventDate = {} as EventDate;
  private profileDTO: ProfileDTO;

  private startTime$: Observable<string> = this.store.select(
    privateEventStartTimeSelector
  );
  private endTime$: Observable<string> = this.store.select(
    privateEventEndTimeSelector
  );
  private eventDate$: Observable<string> = this.store.select(
    privateEventDateSelector
  );
  private privateEventLocation$: Observable<PrivateEventLocationDTO> =
    this.store.select(privateEventLocationSelector);
  private eventStaff$: Observable<ServiceProviderDTO[]> = this.store.select(
    privateEventStaffSelector
  );
  private privateEventAction$: Observable<PrivateEventAction> =
    this.store.select(privateEventActionSelector);
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private locationMappers: LocationMappersService,
    private profileMappers: ProfileMapperService,
    private appResponseService: AppResponseService
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

    const eventStaffSub = this.eventStaff$.subscribe(eventStaff => {
      this.eventStaff = [...eventStaff];
      this.controlIcon = 'add';
    });

    this.subscriptions.add(eventStaffSub);

    const eventLocationSub = this.privateEventLocation$.subscribe(
      privateEventLocation => {
        if (privateEventLocation) {
          this.privateEventLocation = { ...privateEventLocation };
          this.locationDTO = this.locationMappers.privateEventLocationDTO(
            this.privateEventLocation
          );

          if (this.locationDTO)
            this.staffDisplay = EventStaffDisplay.staff_list;
        }
      }
    );

    this.subscriptions.add(eventLocationSub);

    const timeDateSub = combineLatest([
      this.startTime$,
      this.endTime$,
      this.eventDate$,
    ]).subscribe(([startTime, endTime, eventDate]) => {
      if (startTime && endTime && eventDate) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.eventDate = eventDate;
        this.bookingDate = {
          selected: true,
          date: this.eventDate,
          startTime: this.startTime,
          endTime: this.endTime,
        };

        this.bookingDates = [this.bookingDate];
      }
    });

    this.subscriptions.add(timeDateSub);

    const privateEventActionSub = this.privateEventAction$.subscribe(
      privateEventAction => {
        this.privateEventAction = privateEventAction;
        if (this.privateEventAction === PrivateEventAction.edit_event) {
          this.store.dispatch(
            retrievePrivateEventStaff({ profileDTO: this.profileDTO })
          );

          if (!this.locationDTO?.latitude || !this.locationDTO?.longitude) {
            this.store.dispatch(
              retrievePrivateEventLocation({ profileDTO: this.profileDTO })
            );
          }
        }
      }
    );

    this.subscriptions.add(privateEventActionSub);
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

  public updateDisplayPanel(): void {
    if (this.staffDisplay === this.displayOptions.staff_list) {
      this.staffDisplay = this.displayOptions.service_providers;
      this.controlIcon = 'notes';
    } else if (this.staffDisplay === this.displayOptions.service_providers) {
      this.staffDisplay = this.displayOptions.staff_list;
      this.controlIcon = 'add';
    }
  }

  public asUserToken(staff: ServiceProviderDTO) {
    return staff as UserTokenDTO;
  }

  public asVendorToken(staff: ServiceProviderDTO) {
    return staff as VendorTokenDTO;
  }

  public async processServiceProvider(
    serviceProvider: ServiceProviderDTO
  ): Promise<void> {
    this.bookingAction = BookingAction.create;
    this.serviceProvider =
      this.profileMappers.serviceProviderToProfileDTO(serviceProvider);

    const duplicate = this.validateServiceProvider();

    if (duplicate) {
      const messages: string[] = [
        'create-event.private-event.staff.duplicate-staff',
      ];
      this.appResponseService.createAppResponse(
        AppResponseType.error,
        messages
      );
      return;
    }

    this.profileBooking = true;
  }

  public createEventStaffProfile(providerRequests: ProviderRequestDTO[]): void {
    let providerRequest = providerRequests[0];

    if (this.privateEventAction === PrivateEventAction.create_event) {
      const provider: ProfileDTO = providerRequest.provider;
      const serviceProvider: ServiceProviderDTO =
        this.profileMappers.profileToServiceProviderDTO(provider);

      this.eventStaff.push(serviceProvider);
      this.store.dispatch(
        updatePrivateEventStaff({ eventStaff: this.eventStaff })
      );
    } else if (this.privateEventAction === PrivateEventAction.edit_event) {
      providerRequest = {
        ...providerRequest,
        referenceId: this.profileDTO.profileId,
      };

      this.store.dispatch(
        createPrivateEventStaff({
          providerRequest: providerRequest,
          profileDTO: this.profileDTO,
        })
      );
    }

    this.profileBooking = false;
  }

  public cancelEventStaffProfile(providerRequests: ProviderRequestDTO[]): void {
    let providerRequest = providerRequests[0];
    if (this.privateEventAction === PrivateEventAction.create_event) {
      const eventStaff = [...this.eventStaff];
      const provider = providerRequest.provider;

      const profileDTOs: ProfileDTO[] = eventStaff.map(staff =>
        this.profileMappers.serviceProviderToProfileDTO(staff)
      );

      const staffList = profileDTOs.filter(
        staff => staff.profileId !== provider.profileId
      );

      const serviceProviders = staffList.map(staff =>
        this.profileMappers.profileToServiceProviderDTO(staff)
      );

      this.eventStaff = [...serviceProviders];
      this.store.dispatch(
        updatePrivateEventStaff({ eventStaff: this.eventStaff })
      );
    } else if (this.privateEventAction === PrivateEventAction.edit_event) {
      providerRequest = {
        ...providerRequest,
        referenceId: this.profileDTO.profileId,
        requestStatus: RequestStatus.cancelled,
      };

      this.store.dispatch(
        cancelPrivateEventStaff({
          providerRequest: providerRequest,
          profileDTO: this.profileDTO,
        })
      );
    }

    this.profileBooking = false;
  }

  public async processEventStaffProfile(
    serviceProvider: ServiceProviderDTO
  ): Promise<void> {
    this.bookingAction = BookingAction.update;
    this.serviceProvider =
      this.profileMappers.serviceProviderToProfileDTO(serviceProvider);

    this.profileBooking = true;
  }

  private validateServiceProvider(): boolean {
    return this.eventStaff.some(staffProfile => {
      const provider =
        this.profileMappers.serviceProviderToProfileDTO(staffProfile);
      return (
        provider.profile === this.serviceProvider.profile &&
        provider.profileId === this.serviceProvider.profileId
      );
    });
  }
}
