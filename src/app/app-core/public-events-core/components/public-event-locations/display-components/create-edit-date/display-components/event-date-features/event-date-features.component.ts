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
  AppResponseType,
  ComponentAction,
  Device,
  Profiles,
  RequestStatus,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { ProfileMapperService } from '@profile-accounts-core/services';
import { UserTokenDTO } from '@user-profile-core/api/user-profile.dto-models';
import {
  BookingAction,
  ServiceProviderDomains,
} from '@profile-accounts-core/data-models';
import { VendorTokenDTO } from '@vendors-core/api/vendors.dto-models';
import { ServiceProviderDTO } from '@profile-accounts-core/api/profile-accounts.dto-models';
import {
  ProviderRequestDTO,
  LocationDTO,
  ProfileDTO,
} from '@app-core/app-api/app-api.dto-models';
import { EventDate } from '@domain-data-models/app-domain.interfaces';

import {
  EventComponentDTO,
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
  EventComponents,
  LocationDateAction,
  PublicEventAction,
} from '@public-events-core/data-models';
import { FeaturesDisplay } from '@public-events-core/data-models';
import {
  cancelPublicEventFeature,
  createPublicEventFeature,
} from '@public-events-core/store';
import { LocationMappersService } from '@domain-services/mappers';

@Component({
  selector: 'Tsk-event-date-features',
  templateUrl: './event-date-features.component.html',
  styleUrls: ['./event-date-features.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventDateFeaturesComponent implements OnInit, OnDestroy {
  @ViewChild('profile_booking')
  profileBookingDialog!: ElementRef<HTMLDivElement>;
  @Output() public appendFeatureProfile: EventEmitter<ProviderRequestDTO> =
    new EventEmitter();
  @Output() public removeFeatureProfile: EventEmitter<ProviderRequestDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public componentAction: ComponentAction = ComponentAction.event_management;
  public profileOptions: typeof Profiles = Profiles;
  public displayOptions: typeof FeaturesDisplay = FeaturesDisplay;
  public featuresDisplay: FeaturesDisplay = this.displayOptions.features_list;
  public controlIcon: string =
    this.featuresDisplay === FeaturesDisplay.features_list ? 'add' : 'notes';

  public bookingAction: BookingAction;
  public profileDTO: ProfileDTO;
  public bookingDates: EventDate[] = [];
  public profileBooking: boolean = false;

  public location: LocationDTO;
  public serviceProviderDomain: ServiceProviderDomains =
    ServiceProviderDomains.feature_profiles;
  public dateFeatures: ServiceProviderDTO[] = [];

  public confirmationDialog: boolean = false;

  private dateId: string;
  private eventDate: EventComponentDTO;
  private publicEventAction: PublicEventAction;
  private locationDateAction: LocationDateAction;
  private publicEventDate: PublicEventDateDTO;

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
    private appResponseService: AppResponseService
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
        this.processPublicEventDate();
      }
    );

    this.subscriptions.add(publicEventDateSub);
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
    if (this.featuresDisplay === this.displayOptions.features_list) {
      this.featuresDisplay = this.displayOptions.service_providers;
      this.controlIcon = 'notes';
    } else if (this.featuresDisplay === this.displayOptions.service_providers) {
      this.featuresDisplay = this.displayOptions.features_list;
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
    this.profileDTO =
      this.profileMappers.serviceProviderToProfileDTO(serviceProvider);
    const duplicate: boolean = this.validateServiceProvider();

    if (duplicate) {
      const duplicateFeature: string =
        'create-event.public-event.date.duplicate-feature';
      this.appResponseService.createAppResponse(AppResponseType.error, [
        duplicateFeature,
      ]);
      return;
    }

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

  public createDateFeatureProfile(
    providerRequests: ProviderRequestDTO[]
  ): void {
    let providerRequest: ProviderRequestDTO = providerRequests[0];
    if (this.publicEventAction === PublicEventAction.create_event) {
      this.appendFeatureProfile.emit(providerRequest);
      const serviceProvider: ServiceProviderDTO =
        this.profileMappers.profileToServiceProviderDTO(this.profileDTO);
      this.dateFeatures = [...this.dateFeatures, serviceProvider];
    } else if (this.publicEventAction === PublicEventAction.edit_event) {
      if (this.locationDateAction === LocationDateAction.create_date) {
        this.appendFeatureProfile.emit(providerRequest);
        const serviceProvider: ServiceProviderDTO =
          this.profileMappers.profileToServiceProviderDTO(this.profileDTO);
        this.dateFeatures = [...this.dateFeatures, serviceProvider];
      } else if (this.locationDateAction === LocationDateAction.edit_date) {
        providerRequest = { ...providerRequest, referenceId: this.dateId };

        this.store.dispatch(
          createPublicEventFeature({
            providerRequest: providerRequest,
            eventDate: this.eventDate,
          })
        );
      }
    }

    this.profileBooking = false;
  }

  public processEventDateFeature(serviceProvider: ServiceProviderDTO) {
    this.bookingAction = BookingAction.update;
    this.profileDTO =
      this.profileMappers.serviceProviderToProfileDTO(serviceProvider);

    const profileDate: EventDate = {
      selected: true,
      referenceId: this.publicEventDate?.dateId,
      date: this.publicEventDate?.eventDate,
      startTime: this.publicEventDate?.startTime,
      endTime: this.publicEventDate?.endTime,
    };

    this.bookingDates = [profileDate];
    this.profileBooking = true;
  }

  public cancelDateFeatureProfile(
    createEventProfiles: ProviderRequestDTO[]
  ): void {
    let providerRequest: ProviderRequestDTO = createEventProfiles[0];
    if (
      this.publicEventAction === PublicEventAction.edit_event &&
      this.locationDateAction === LocationDateAction.edit_date
    ) {
      providerRequest = {
        ...providerRequest,
        referenceId: this.dateId,
        requestStatus: RequestStatus.cancelled,
      };

      this.store.dispatch(
        cancelPublicEventFeature({
          providerRequest: providerRequest,
          eventDate: this.eventDate,
        })
      );
    } else {
      this.removeFeatureProfile.emit(providerRequest);
      const profileDTOs: ProfileDTO[] = this.dateFeatures.map(feature =>
        this.profileMappers.serviceProviderToProfileDTO(feature)
      );

      const updatedList = profileDTOs.filter(
        profileDTO => profileDTO.profileId !== this.profileDTO.profileId
      );

      const serviceProviders = updatedList.map(profileDTO =>
        this.profileMappers.profileToServiceProviderDTO(profileDTO)
      );
      this.dateFeatures = [...serviceProviders];
    }

    this.profileBooking = false;
  }

  private processPublicEventDate(): void {
    if (this.locationDateAction === LocationDateAction.edit_date) {
      this.dateId = this.publicEventDate.dateId;

      this.eventDate = {
        component: EventComponents.event_date,
        componentId: this.dateId,
      };

      const dateFeatures = this.publicEventDate?.dateFeatures;
      this.dateFeatures = dateFeatures;
    }
  }

  private validateServiceProvider(): boolean {
    return this.dateFeatures.some(feature => {
      const featureProfile =
        this.profileMappers.serviceProviderToProfileDTO(feature);
      return (
        featureProfile.profile === this.profileDTO.profile &&
        featureProfile.profileId === this.profileDTO.profileId
      );
    });
  }
}
