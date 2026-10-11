import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
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
import { PrivateEventAction } from '@private-events-core/data-models';
import {
  privateEventDateSelector,
  privateEventFeaturesSelector,
  privateEventLocationSelector,
  privateEventStartTimeSelector,
  privateEventEndTimeSelector,
  privateEventActionSelector,
  retrievePrivateEventFeatures,
  createPrivateEventFeature,
  cancelPrivateEventFeature,
} from '@private-events-core/store/create-edit-event';
import { PrivateEventLocationDTO } from '@private-events-core/api';
import { LocationMappersService } from '@domain-services/mappers';
import { profileDTOSelector } from '@app-domain/store';

enum FeaturesDisplay {
  features_list = 'FEATURES_LIST',
  service_providers = 'SERVICE_PROVIDERS',
}

@Component({
  selector: 'Tsk-event-features',
  templateUrl: './event-features.component.html',
  styleUrls: ['./event-features.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventFeaturesComponent implements OnInit {
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

  public locationDTO: LocationDTO;
  public bookingAction: BookingAction;
  public serviceProvider: ProfileDTO;
  public bookingDates: EventDate[] = [];
  public profileBooking: boolean = false;

  public serviceProviderDomain: ServiceProviderDomains =
    ServiceProviderDomains.feature_profiles;
  public eventFeatures: ServiceProviderDTO[] = [];

  public confirmationDialog: boolean = false;

  private privateEventAction: PrivateEventAction;
  private eventLocation: PrivateEventLocationDTO;
  private startTime: string;
  private endTime: string;
  private eventDate: string;
  private bookingDate: EventDate = {} as EventDate;
  private profileDTO: ProfileDTO;

  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
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
  private eventFeatures$: Observable<ServiceProviderDTO[]> = this.store.select(
    privateEventFeaturesSelector
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

    const profleDTOSub = this.profileDTO$.subscribe(
      profileDTO => (this.profileDTO = profileDTO)
    );

    this.subscriptions.add(profleDTOSub);

    const privateEventActionSub = this.privateEventAction$.subscribe(
      privateEventAction => {
        this.privateEventAction = privateEventAction;
        if (this.privateEventAction === PrivateEventAction.edit_event) {
          this.store.dispatch(
            retrievePrivateEventFeatures({ profileDTO: this.profileDTO })
          );
        }
      }
    );

    this.subscriptions.add(privateEventActionSub);

    const eventLocationSub = this.privateEventLocation$.subscribe(
      eventLocation => {
        this.eventLocation = eventLocation;
        this.locationDTO = this.locationMappers.privateEventLocationDTO(
          this.eventLocation
        );
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

    const eventFeaturesSub = this.eventFeatures$.subscribe(eventFeatures => {
      this.eventFeatures = eventFeatures;
      this.controlIcon = 'add';
    });

    this.subscriptions.add(eventFeaturesSub);
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
    if (this.featuresDisplay === this.displayOptions.features_list) {
      this.featuresDisplay = this.displayOptions.service_providers;
      this.controlIcon = 'notes';
    } else if (this.featuresDisplay === this.displayOptions.service_providers) {
      this.featuresDisplay = this.displayOptions.features_list;
      this.controlIcon = 'add';
    }
  }

  public asUserToken(serviceProvider: ServiceProviderDTO) {
    return serviceProvider as UserTokenDTO;
  }

  public asVendorToken(serviceProvider: ServiceProviderDTO) {
    return serviceProvider as VendorTokenDTO;
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
        'create-event.private-event.location.duplicate-feature',
      ];
      this.appResponseService.createAppResponse(
        AppResponseType.error,
        messages
      );
      return;
    }

    this.profileBooking = true;
  }

  public createEventFeature(providerRequests: ProviderRequestDTO[]): void {
    let providerRequest: ProviderRequestDTO = providerRequests[0];

    if (this.privateEventAction === PrivateEventAction.create_event) {
      this.appendFeatureProfile.emit(providerRequest);
    } else if (this.privateEventAction === PrivateEventAction.edit_event) {
      providerRequest = {
        ...providerRequest,
        referenceId: this.profileDTO.profileId,
      };

      this.store.dispatch(
        createPrivateEventFeature({
          providerRequest: providerRequest,
          profileDTO: this.profileDTO,
        })
      );
    }

    this.profileBooking = false;
  }

  public processEventFeature(serviceProvider: ServiceProviderDTO) {
    this.bookingAction = BookingAction.update;
    this.serviceProvider =
      this.profileMappers.serviceProviderToProfileDTO(serviceProvider);

    this.profileBooking = true;
  }

  public removeEventFeature(createEventProfiles: ProviderRequestDTO[]): void {
    let providerRequest: ProviderRequestDTO = createEventProfiles[0];
    if (this.privateEventAction === PrivateEventAction.create_event) {
      this.removeFeatureProfile.emit(providerRequest);
      const profileDTOs: ProfileDTO[] = this.eventFeatures.map(feature =>
        this.profileMappers.serviceProviderToProfileDTO(feature)
      );

      const updatedList = profileDTOs.filter(
        profileDTO => profileDTO.profileId !== this.serviceProvider.profileId
      );

      const serviceProviders = updatedList.map(profileDTO =>
        this.profileMappers.profileToServiceProviderDTO(profileDTO)
      );
      this.eventFeatures = [...serviceProviders];
    } else if (this.privateEventAction === PrivateEventAction.edit_event) {
      providerRequest = {
        ...providerRequest,
        referenceId: this.profileDTO.profileId,
        requestStatus: RequestStatus.cancelled,
      };

      this.store.dispatch(
        cancelPrivateEventFeature({
          providerRequest: providerRequest,
          profileDTO: this.profileDTO,
        })
      );
    }

    this.profileBooking = false;
  }

  private validateServiceProvider(): boolean {
    return this.eventFeatures.some(eventFeature => {
      const provider =
        this.profileMappers.serviceProviderToProfileDTO(eventFeature);
      return (
        provider.profile === this.serviceProvider.profile &&
        provider.profileId === this.serviceProvider.profileId
      );
    });
  }
}
