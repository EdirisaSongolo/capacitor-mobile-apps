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
import { Observable, Subscription } from 'rxjs';

import { BreakPointService } from '@domain-services/index';
import { DateTimeService } from '@domain-services/date-time/date-time.service';
import { ProfileImageService } from '@media-core/services';
import {
  Device,
  EventTypes,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BookingTokenDTO } from '@profile-revenue-core/api';
import { UserEventDTO } from '@app-core/app-api';
import { PublicEventTokenDTO } from '@public-events-core/api';
import { PrivateEventTokenDTO } from '@private-events-core/api';
import {
  BusinessProfileDTO,
  ServiceProviderDTO,
} from '@profile-accounts-core/api';
import { UserTokenDTO } from '@user-profile-core/api';
import { VenueTokenDTO } from '@venues-core/api';
import { VendorTokenDTO } from '@vendors-core/api';

@Component({
  selector: 'Tsk-booking-invoice-plac',
  templateUrl: './booking-invoice-plac.component.html',
  styleUrls: ['./booking-invoice-plac.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BookingInvoicePlacComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() public bookingToken: BookingTokenDTO;
  @Output() public placAction: EventEmitter<BookingTokenDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public placDetails: any = {
    providerImage: null,
    eventImage: null,
    eventName: null,
    eventDate: null,
    eventTime: null,
    bookingStatus: null,
  };

  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private dateTimeService: DateTimeService,
    private profileImageService: ProfileImageService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const bookingTokenChanges = changes['bookingToken'];
    if (bookingTokenChanges?.currentValue) {
      this.processBookingRequestData();
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public processPlacAction(): void {
    this.placAction.emit(this.bookingToken);
  }

  private processBookingRequestData(): void {
    const provider: ServiceProviderDTO = this.bookingToken.serviceProvider;
    const providerImage = provider.profileImage;
    const defaultProfileImage = this.profileImageService.defaultProfileImage(
      provider.profile as Profiles
    );
    const profileImage = providerImage
      ? `url(${providerImage}) center/ contain no-repeat`
      : defaultProfileImage;
    this.placDetails.providerImage = profileImage;

    const businessProfile: BusinessProfileDTO = provider.businessProfile;
    this.placDetails.providerCategory = businessProfile.businessCategory;

    if (provider.profile === Profiles.userProfile) {
      const userToken = provider as UserTokenDTO;
      this.placDetails.providerName = userToken.userName;
    } else if (provider.profile === Profiles.venueProfile) {
      const venueToken = provider as VenueTokenDTO;
      this.placDetails.providerName = venueToken.venueName;
    } else if (provider.profile === Profiles.vendorProfile) {
      const vendorToken = provider as VendorTokenDTO;
      this.placDetails.providerName = vendorToken.vendorName;
    }

    const eventDTO: UserEventDTO = this.bookingToken.userEvent;
    this.placDetails.eventName = eventDTO.eventName;

    if (eventDTO.eventType === EventTypes.publicEvent) {
      const publicEvent = eventDTO as PublicEventTokenDTO | any;
      const tokenLocationDate = publicEvent.tokenLocationDate;
      this.placDetails.eventDate = tokenLocationDate.eventDate;
      this.placDetails.eventTime =
        this.dateTimeService.processApiTimeRangeResponse(
          tokenLocationDate.startTime,
          tokenLocationDate.endTime
        );
    } else if (eventDTO.eventType === EventTypes.privateEvent) {
      const privateEvent = eventDTO as PrivateEventTokenDTO;
      this.placDetails.eventDate = privateEvent.eventDate;
      this.placDetails.eventTime =
        this.dateTimeService.processApiTimeRangeResponse(
          privateEvent.startTime,
          privateEvent.endTime
        );
    }

    this.placDetails.eventDate = this.dateTimeService.processApiDateResponse(
      this.placDetails.eventDate
    );

    this.placDetails.bookingStatus = this.bookingToken.bookingStatus;
  }
}
