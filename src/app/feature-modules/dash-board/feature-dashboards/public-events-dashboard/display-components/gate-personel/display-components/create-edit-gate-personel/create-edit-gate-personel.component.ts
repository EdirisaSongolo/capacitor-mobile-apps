import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom, Observable, skip, Subscription } from 'rxjs';

import {
  AppResponseType,
  ComponentAction,
  Device,
  Profiles,
  RequestStatus,
} from '@domain-data-models/app-domain.enums';
import { EventDate } from '@domain-data-models/app-domain.interfaces';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import {
  ApiCallIndicatorService,
  LocationDTO,
  ProfileDTO,
  ProviderRequestDTO,
} from '@app-core/app-api';
import { LocationMappersService } from '@domain-services/mappers';
import {
  DateTokenDTO,
  EventComponentDTO,
  EventProviderDTO,
  PublicEventLocationDTO,
} from '@public-events-core/api';
import {
  createGateCrew,
  gateCrewLocationDatesSelector,
  locationGateCrewSelector,
  publicEventLocationSelector,
  retrieveGateCrewLocationDates,
  retrieveLocationGateCrew,
  updateGateCrew,
} from '@public-events-core/store';
import { EventComponents } from '@public-events-core/data-models';
import { UserTokenDTO } from '@user-profile-core/api';
import { VendorTokenDTO } from '@vendors-core/api';
import { PublicEventMappersService } from '@public-events-core/services';
import { ProfileMapperService } from '@profile-accounts-core/services';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import {
  BookingAction,
  ServiceProviderDomains,
} from '@profile-accounts-core/data-models';

enum GatePersonnelDisplay {
  personnel_list = 'PERSONNEL_LIST',
  provider_search = 'PROVIDER_SEARCH',
}

@Component({
  selector: 'Tsk-create-edit-gate-personel',
  templateUrl: './create-edit-gate-personel.component.html',
  styleUrls: ['./create-edit-gate-personel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreateEditGatePersonelComponent implements OnInit, OnDestroy {
  @ViewChild('profile_booking')
  profileBookingDialog!: ElementRef<HTMLDivElement>;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public displayOptions: typeof GatePersonnelDisplay = GatePersonnelDisplay;
  public personnelDisplay: GatePersonnelDisplay =
    GatePersonnelDisplay.personnel_list;
  public controlIcon: string = 'add';

  public profileOptions: typeof Profiles = Profiles;
  public componentAction: ComponentAction = ComponentAction.event_management;
  public gatePersonnel: ServiceProviderDTO[] = [];

  public serviceProviderDomain: ServiceProviderDomains =
    ServiceProviderDomains.staff_profiles;
  public location: LocationDTO;
  public bookingAction: BookingAction;
  public bookingProfile: ProfileDTO;
  public profileBooking: boolean = false;

  public publicEventLocation: PublicEventLocationDTO;
  public locationDatesTokens: DateTokenDTO[] = [];
  public bookingDates: EventDate[] = [];
  public gateCrewLocationDates: DateTokenDTO[] = [];

  private eventLocation: EventComponentDTO;

  private publicEventLocation$: Observable<PublicEventLocationDTO> =
    this.store.select(publicEventLocationSelector);
  private locationGateCrew$: Observable<ServiceProviderDTO[]> =
    this.store.select(locationGateCrewSelector);
  private gateCrewLocationDates$: Observable<DateTokenDTO[]> =
    this.store.select(gateCrewLocationDatesSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private profileMappers: ProfileMapperService,
    private locationMappers: LocationMappersService,
    private publicEventMappers: PublicEventMappersService,
    private apiCallIndicator: ApiCallIndicatorService,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const publicEventLocationSub = this.publicEventLocation$.subscribe(
      publicEventLocation => {
        if (publicEventLocation) {
          this.publicEventLocation = publicEventLocation;
          this.location = this.locationMappers.publicEventLocationDTO(
            this.publicEventLocation
          );

          if (this.publicEventLocation.eventDates) {
            this.locationDatesTokens = this.publicEventLocation.eventDates.map(
              date => this.publicEventMappers.dateTokenDTOMapper(date)
            );
          }

          this.eventLocation = {
            component: EventComponents.event_location,
            componentId: this.publicEventLocation.locationId,
          };

          this.store.dispatch(
            retrieveLocationGateCrew({ eventLocation: this.eventLocation })
          );
        }
      }
    );

    this.subscriptions.add(publicEventLocationSub);

    const locationGateCrewSub = this.locationGateCrew$.subscribe(
      gatePersonnel => {
        if (gatePersonnel) {
          this.gatePersonnel = [...gatePersonnel];
        }
      }
    );

    this.subscriptions.add(locationGateCrewSub);

    const gateCrewLocationDatesSub = this.gateCrewLocationDates$.subscribe(
      gateCrewLocationDates =>
        (this.gateCrewLocationDates = [...gateCrewLocationDates])
    );

    this.subscriptions.add(gateCrewLocationDatesSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public asUserToken(serviceProvider: ServiceProviderDTO) {
    return serviceProvider as UserTokenDTO;
  }

  public asVendorToken(serviceProvider: ServiceProviderDTO) {
    return serviceProvider as VendorTokenDTO;
  }

  public updateDisplayPanel(): void {
    if (this.personnelDisplay === this.displayOptions.personnel_list) {
      this.personnelDisplay = this.displayOptions.provider_search;
      this.controlIcon = 'notes';
    } else if (this.personnelDisplay === this.displayOptions.provider_search) {
      this.personnelDisplay = this.displayOptions.personnel_list;
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

  public processServiceProvider(serviceProvider: ServiceProviderDTO): void {
    this.bookingAction = BookingAction.create;
    this.bookingProfile =
      this.profileMappers.serviceProviderToProfileDTO(serviceProvider);
    this.bookingDates = this.processEventLocationDates();
    this.profileBooking = true;
  }

  public async processGatePersonnel(
    serviceProvider: ServiceProviderDTO
  ): Promise<void> {
    this.bookingAction = BookingAction.update;
    this.bookingProfile =
      this.profileMappers.serviceProviderToProfileDTO(serviceProvider);

    await this.retrieveGateCrewLocationDates(this.bookingProfile);
    this.bookingDates = this.processGateCrewLocationDates(
      this.gateCrewLocationDates
    );

    this.profileBooking = true;
  }

  public createGatePersonnel(providerRequests: ProviderRequestDTO[]): void {
    this.store.dispatch(
      createGateCrew({
        providerRequests: providerRequests,
        eventLocation: this.eventLocation,
      })
    );

    this.profileBooking = false;
  }

  public updateGatePersonnel(providerRequests: ProviderRequestDTO[]): void {
    const scheduledDates = this.processGateCrewLocationDates(
      this.gateCrewLocationDates
    );
    const requestUpdates = this.processProviderRequestsUpdates(
      scheduledDates,
      providerRequests
    );

    if (requestUpdates.length === 0) {
      const messages: string[] = ['create-event.public-event.staff.no-changes'];
      this.appResponseService.createAppResponse(
        AppResponseType.warning,
        messages
      );
      return;
    }

    this.store.dispatch(
      updateGateCrew({
        providerRequests: requestUpdates,
        eventLocation: this.eventLocation,
      })
    );

    this.profileBooking = false;
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

  private async retrieveGateCrewLocationDates(
    profileDTO: ProfileDTO
  ): Promise<void> {
    const eventProvider: EventProviderDTO = {
      component: EventComponents.event_location,
      componentId: this.publicEventLocation.locationId,
      profileDTO: profileDTO,
    };

    this.store.dispatch(
      retrieveGateCrewLocationDates({ eventProvider: eventProvider })
    );

    await firstValueFrom(
      this.apiCallIndicator.apiCallInProgress$.pipe(
        skip(1),
        filter(inprogress => !inprogress)
      )
    );
  }

  private processGateCrewLocationDates(
    gateCrewLocationDates: DateTokenDTO[]
  ): EventDate[] {
    const profileDates: EventDate[] = [];
    const profileDateIds = gateCrewLocationDates.map(date => date.dateId);
    this.locationDatesTokens.forEach(locationDate => {
      const scheduled = profileDateIds.includes(locationDate.dateId);

      const profileDate: EventDate = {
        selected: scheduled,
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
    scheduledDates: EventDate[],
    providerRequests: ProviderRequestDTO[]
  ): ProviderRequestDTO[] {
    const requestUpdates: ProviderRequestDTO[] = [];
    const locationDatesIds = this.publicEventLocation.eventDates.map(
      date => date.dateId
    );
    const bookedDates = scheduledDates.filter(date => date.selected);
    const scheduledDatesIds = bookedDates.map(date => date.referenceId);
    const requestsDatesIds = providerRequests.map(
      request => request.referenceId
    );

    for (const locationDateId of locationDatesIds) {
      const scheduled = scheduledDatesIds.includes(locationDateId);
      const requested = requestsDatesIds.includes(locationDateId);

      if (scheduled && requested) continue;

      if (scheduled && !requested) {
        const update: ProviderRequestDTO = {
          referenceId: locationDateId,
          provider: this.bookingProfile,
          requestStatus: RequestStatus.cancelled,
        };

        requestUpdates.push(update);
      }

      if (!scheduled && requested) {
        const update: ProviderRequestDTO = {
          referenceId: locationDateId,
          provider: this.bookingProfile,
          requestStatus: RequestStatus.confirmed,
        };

        requestUpdates.push(update);
      }
    }

    return requestUpdates;
  }
}
