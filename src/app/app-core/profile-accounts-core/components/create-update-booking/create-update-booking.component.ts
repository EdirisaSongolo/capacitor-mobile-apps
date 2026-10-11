import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  ProviderRequestDTO,
  ProfileDTO,
} from '@app-core/app-api/app-api.dto-models';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import {
  AppResponseType,
  Device,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { EventDate } from '@domain-data-models/app-domain.interfaces';
import {
  BusinessProfileDTO,
  ServiceProviderDTO,
} from '@profile-accounts-core/api';
import { UserProfileConstants } from '@user-profile-core/data-models';
import { UserTokenDTO } from '@user-profile-core/api';
import { VendorsConstants } from '@vendors-core/data-models';
import { VendorTokenDTO } from '@vendors-core/api';
import { VenuesConstants } from '@venues-core/data-models';
import { VenueTokenDTO } from '@venues-core/api';
import {
  retrieveServiceProvider,
  serviceProviderSelector,
} from '@profile-accounts-core/store';
import {
  BookingAction,
  BusinessProfileDetails,
  BusinessProfileStatus,
  ProviderDetails,
} from '@profile-accounts-core/data-models';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { ProfileProcessorService } from '@profile-accounts-core/services/profile-processors/profile-processor.service';
import { DateTimeService } from '@domain-services/index';

@Component({
  selector: 'Tsk-create-update-booking',
  templateUrl: './create-update-booking.component.html',
  styleUrls: ['./create-update-booking.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreateUpdateBookingComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() public bookingAction: BookingAction;
  @Input() public profileDTO: ProfileDTO;
  @Input() public bookingDates: EventDate[] = [];
  @Output() public closeDialog: EventEmitter<void> = new EventEmitter();
  @Output() public createBooking: EventEmitter<ProviderRequestDTO[]> =
    new EventEmitter();
  @Output() public updateBooking: EventEmitter<ProviderRequestDTO[]> =
    new EventEmitter();

  public controlIcon = 'remove';

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public actionOptions: typeof BookingAction = BookingAction;
  public updateLabel: string;

  public providerDetails: ProviderDetails = {
    profileImage: null,
    profileName: null,
    businessCategory: null,
    profileLocation: null,
    profileBaseRate: 0,
    profileRateUnits: null,
    profileServices: [],
    profileStatus: null,
  };

  private serviceProvider: ServiceProviderDTO;
  private serviceProvider$: Observable<ServiceProviderDTO> = this.store.select(
    serviceProviderSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private profileProcessor: ProfileProcessorService,
    private dateTimeService: DateTimeService,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const serviceProviderSub = this.serviceProvider$.subscribe(
      serviceProvider => {
        if (serviceProvider) {
          this.serviceProvider = { ...serviceProvider };
          this.processServiceProvider();
        }
      }
    );

    this.subscriptions.add(serviceProviderSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const profileChanges = changes['profileDTO'];
    if (profileChanges?.currentValue) {
      this.store.dispatch(
        retrieveServiceProvider({ profileDTO: this.profileDTO })
      );
    }

    const bookingDatesChanges = changes['bookingDates'];
    if (bookingDatesChanges?.currentValue) {
      this.processBookingDates(this.bookingDates);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public closeProfileBooking(): void {
    this.closeDialog.emit();
  }

  public toggleDateSelection(bookingDate: EventDate): void {
    this.bookingDates.forEach(date => {
      if (date.referenceId === bookingDate.referenceId) {
        date.selected = !bookingDate.selected;
      }
    });

    if (this.bookingAction === BookingAction.update) {
      const selected = this.bookingDates.filter(date => date.selected).length;
      this.updateLabel =
        selected >= 1 ? 'button-label.update' : 'button-label.cancel';
    }
  }

  public createProfileBooking(): void {
    const providerAvailable: boolean = this.validateProviderStatus();
    if (!providerAvailable) return;

    const profileBookingDTOs: ProviderRequestDTO[] = [];
    if (this.bookingDates.length > 1) {
      this.bookingDates.forEach(bookingDate => {
        if (bookingDate.selected) {
          const profileBooking: ProviderRequestDTO = {
            referenceId: bookingDate?.referenceId,
            provider: this.profileDTO,
          };

          profileBookingDTOs.push(profileBooking);
        }
      });
      this.createBooking.emit(profileBookingDTOs);
      return;
    }

    const referenceId = this.bookingDates[0]?.referenceId;
    const profileBooking: ProviderRequestDTO = {
      referenceId: referenceId,
      provider: this.profileDTO,
    };

    profileBookingDTOs.push(profileBooking);
    this.createBooking.emit(profileBookingDTOs);
  }

  public updateProfileBooking(): void {
    const profileBookingDTOs: ProviderRequestDTO[] = [];
    this.bookingDates.forEach(bookingDate => {
      if (bookingDate.selected) {
        const profileBooking: ProviderRequestDTO = {
          referenceId: bookingDate.referenceId,
          provider: this.profileDTO,
        };

        profileBookingDTOs.push(profileBooking);
      }
    });

    this.updateBooking.emit(profileBookingDTOs);
  }

  private validateProviderStatus(): boolean {
    if (this.providerDetails.profileStatus === BusinessProfileStatus.enabled) {
      return true;
    }

    const messages: string[] = [
      'profile-revenue.profile-booking.not-available',
    ];
    this.appResponseService.createAppResponse(
      AppResponseType.warning,
      messages
    );
    return false;
  }

  private processBookingDates(bookingDates: EventDate[]): void {
    bookingDates.forEach(bookingDate => {
      bookingDate.date = this.dateTimeService.processApiDateResponse(
        bookingDate.date
      );
      bookingDate.eventTime = this.dateTimeService.processApiTimeRangeResponse(
        bookingDate.startTime,
        bookingDate.endTime
      );
    });

    this.updateLabel =
      bookingDates.length === 1 ? 'button-label.cancel' : 'button-label.update';
  }

  private processServiceProvider(): void {
    let defaultProfileImage: string;
    if (this.serviceProvider.profile === Profiles.userProfile) {
      defaultProfileImage = UserProfileConstants.DEFAULT_PROFILE_IMAGE;

      const userTokenDTO = this.serviceProvider as UserTokenDTO;
      this.providerDetails.profileName = userTokenDTO.userName;
    } else if (this.serviceProvider.profile === Profiles.vendorProfile) {
      defaultProfileImage = VendorsConstants.DEFAULT_PROFILE_IMAGE;

      const vendorTokenDTO = this.serviceProvider as VendorTokenDTO;
      this.providerDetails.profileName = vendorTokenDTO.vendorName;
    } else if (this.serviceProvider.profile === Profiles.venueProfile) {
      defaultProfileImage = VenuesConstants.DEFAULT_PROFILE_IMAGE;

      const venueTokenDTO = this.serviceProvider as VenueTokenDTO;
      this.providerDetails.profileName = venueTokenDTO.venueName;
    }

    const profileImagePath = this.serviceProvider.profileImage
      ? this.serviceProvider.profileImage
      : defaultProfileImage;
    this.providerDetails.profileImage = `url(${profileImagePath}) center/ contain no-repeat`;
    this.providerDetails.profileLocation = `${this.serviceProvider.profileLocation.city}, ${this.serviceProvider.profileLocation.state}`;

    const businessProfile: BusinessProfileDTO =
      this.serviceProvider.businessProfile;
    const businessProfileDetails: BusinessProfileDetails =
      this.profileProcessor.processBusinessProfile(businessProfile);

    this.providerDetails = {
      ...this.providerDetails,
      ...businessProfileDetails,
    };
  }
}
