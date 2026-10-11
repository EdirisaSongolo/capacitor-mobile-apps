import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { BreakPointService } from '@domain-services/break-point/break-point.service';
import {
  DialogAction,
  Device,
  EventTypes,
  Profiles,
  ReferencedResources,
  RequestStatus,
} from '@domain-data-models/app-domain.enums';
import {
  LocationDTO,
  ProfileDTO,
  ResourceReferenceDTO,
  UserEventDTO,
} from '@app-core/app-api';
import {
  componentResourceSelector,
  setComponentResource,
} from '@app-domain/store';
import { GeoLocationService } from '@domain-services/geo-location-api/geo-location.service';
import { DateTimeService } from '@domain-services/date-time/date-time.service';

import {
  InvoiceDTO,
  ProfileBookingDTO,
  PaymentIntentDTO,
  PaymentTransactionDTO,
  ManageBookingDTO,
  EventRefenceDTO,
  TransactionMetaData,
} from '@profile-revenue-core/api';

import {
  cancelBookingRequest,
  profileBookingSelector,
  retrieveBookingRequestDetails,
  submitBookingInvoicePayment,
} from '@profile-revenue-core/store';
import {
  BookingDetails,
  BookingResponse,
  InvoiceStatus,
  ProfileRevenueConstants,
  TransactionDetails,
  TransactionReference,
} from '@profile-revenue-core/data-models';
import { UserAccountRoutes } from '@user-profile-core/data-models/user-account.routes';

import { PublicEventTokenDTO } from '@public-events-core/api';
import { PrivateEventTokenDTO } from '@private-events-core/api';

import {
  BusinessProfileDTO,
  ServiceProviderDTO,
} from '@profile-accounts-core/api';
import { ProfileMapperService } from '@profile-accounts-core/services';
import { UserEventMapperService } from '@domain-services/mappers';

import {
  BusinessProfileDetails,
  ProviderDetails,
} from '@profile-accounts-core/data-models';
import { ProfileProcessorService } from '@profile-accounts-core/services/profile-processors/profile-processor.service';
import { ProfileImageService } from '@media-core/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'Tsk-booking-invoice',
  templateUrl: './booking-invoice.component.html',
  styleUrls: ['./booking-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BookingInvoiceComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileBooking: ProfileBookingDTO;
  public bookingDetails: BookingDetails = {
    bookingType: '',
    eventDetails: null,
    providerDetails: null,
    invoiceTotal: 0,
    invoiceStatus: '',
  };

  public declineIcon: string = 'close';
  public acceptIcon: string = 'check';
  public response: BookingResponse = BookingResponse.confirm;
  public responseOptions: typeof BookingResponse = BookingResponse;

  public bookingStatus: RequestStatus = RequestStatus.pending;
  public bookingStatusOptions: typeof RequestStatus = RequestStatus;

  public bookingInvoice: InvoiceDTO;
  public invoiceStatus: InvoiceStatus = InvoiceStatus.pending;
  public invoiceStatusOptions: typeof InvoiceStatus = InvoiceStatus;

  public paymentDialog: boolean = false;
  public paymentIntent: PaymentIntentDTO;
  public transactionDetails: TransactionDetails;

  public confirmationMessage: string =
    'profile-revenue.profile-booking.cancel-booking.confirmation-text';
  public confirmationDialog: boolean = false;

  private componentResource: ResourceReferenceDTO;

  private profileBooking$: Observable<ProfileBookingDTO> = this.store.select(
    profileBookingSelector
  );
  private componentResource$: Observable<ResourceReferenceDTO> =
    this.store.select(componentResourceSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private geoLocationService: GeoLocationService,
    private dateTimeService: DateTimeService,
    private profileMapperService: ProfileMapperService,
    private userEventMapperService: UserEventMapperService,
    private profileProcessor: ProfileProcessorService,
    private profileImageService: ProfileImageService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const activatedRouteSub = this.activatedRoute.paramMap.subscribe(
      parameters => {
        const bookingId = parameters.get(UserAccountRoutes.BOOKING_ID);
        const resourceReference: ResourceReferenceDTO = {
          resource: ReferencedResources.profileBooking,
          referenceId: bookingId,
        };

        this.store.dispatch(
          setComponentResource({ componentResource: resourceReference })
        );
      }
    );

    this.subscriptions.add(activatedRouteSub);

    const componentResourceSub = this.componentResource$.subscribe(
      componentResource => {
        if (
          componentResource &&
          componentResource.resource === ReferencedResources.profileBooking
        ) {
          this.componentResource = { ...componentResource };
          this.store.dispatch(
            retrieveBookingRequestDetails({
              resourceReference: this.componentResource,
            })
          );
        }
      }
    );

    this.subscriptions.add(componentResourceSub);

    const profileBookingSub = this.profileBooking$.subscribe(profileBooking => {
      if (profileBooking) {
        this.profileBooking = { ...profileBooking };
        this.processBookingRequestData();
      }
    });

    this.subscriptions.add(profileBookingSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public bookingResponse(response: BookingResponse): void {
    this.response = response;
  }

  public closePaymentDialog(): void {
    this.paymentDialog = false;
  }

  public initiateInvoicePayment(): void {
    const serviceProvider: ServiceProviderDTO =
      this.profileBooking.serviceProvider;
    const merchantProfile: ProfileDTO =
      this.profileMapperService.serviceProviderToProfileDTO(serviceProvider);

    this.paymentIntent = {
      merchantProfile: merchantProfile,
      amountInCents: this.bookingInvoice.amountInCents,
      currency: 'usd',
    };

    const eventDetails = this.bookingDetails.eventDetails;
    const transactionMetaData: TransactionMetaData = {
      name: this.bookingDetails.providerDetails.profileName,
      quantity: 1,
      price: this.bookingInvoice.amountInCents,
      total: this.bookingInvoice.amountInCents,
    };

    const receiptName = this.translateService.instant(
      this.bookingDetails.providerDetails.businessCategory
    );

    this.transactionDetails = {
      transactionReference: TransactionReference.booking_invoice,
      transactionReferenceId: this.profileBooking.bookingId,
      receiptImage: eventDetails.eventImage,
      receiptHeader: eventDetails.eventName,
      referenceDate: eventDetails.eventDate,
      referenceTime: eventDetails.eventTime,
      receiptName: receiptName,
      transactionMetaData: [transactionMetaData],
    };

    this.paymentDialog = true;
  }

  public submitBookingInvoicePayment(
    paymentTransaction: PaymentTransactionDTO
  ): void {
    this.store.dispatch(
      submitBookingInvoicePayment({
        resourceReference: this.componentResource,
        paymentTransaction: paymentTransaction,
      })
    );
    this.closePaymentDialog();

    this.store.dispatch(
      retrieveBookingRequestDetails({
        resourceReference: this.componentResource,
      })
    );
  }

  public confirmBookingCancellation(): void {
    if (this.paymentDialog) this.closePaymentDialog();
    this.confirmationDialog = true;
  }

  public propateDialogAction(dialogAction: DialogAction) {
    if (dialogAction === DialogAction.cancelled) {
      this.confirmationDialog = false;
    } else if (dialogAction === DialogAction.confirmed) {
      this.cancelBookingRequest();
      this.confirmationDialog = false;
    }
  }

  private cancelBookingRequest(): void {
    const serviceProvider: ServiceProviderDTO =
      this.profileBooking.serviceProvider;
    const providerReference: ProfileDTO =
      this.profileMapperService.serviceProviderToProfileDTO(serviceProvider);

    const userEvent: UserEventDTO = this.profileBooking.userEvent;
    const eventReference: EventRefenceDTO =
      this.userEventMapperService.userEventToEventReferenceDTO(userEvent);

    const manageBookingDTO: ManageBookingDTO = {
      bookingType: this.bookingDetails.bookingType,
      providerReference: providerReference,
      eventReference: eventReference,
      requestStatus: RequestStatus.cancelled,
    };

    this.store.dispatch(
      cancelBookingRequest({
        resourceReference: this.componentResource,
        manageBooking: manageBookingDTO,
      })
    );
  }

  private async processBookingRequestData(): Promise<void> {
    this.bookingDetails.bookingType = this.profileBooking.bookingType;

    const eventDetails: any = {};
    const eventDTO = this.profileBooking.userEvent;
    eventDetails.eventName = eventDTO.eventName;
    const eventImage = eventDTO.profileImage;
    const defaultEventImage = this.profileImageService.defaultProfileImage(
      eventDTO.profile as Profiles
    );
    const eventProfileImage = eventImage
      ? `url(${eventImage}) center center / contain no-repeat`
      : defaultEventImage;
    eventDetails.eventImage = eventProfileImage;

    let startTime: string;
    let endTime: string;
    let eventDate: string;
    let eventLocation: LocationDTO;

    if (eventDTO.eventType === EventTypes.publicEvent) {
      const publicEvent = eventDTO as PublicEventTokenDTO;
      const tokenLocationDate = publicEvent.tokenLocationDate;

      startTime = tokenLocationDate.startTime;
      endTime = tokenLocationDate.endTime;
      eventDate = tokenLocationDate.eventDate;
      eventLocation = tokenLocationDate.eventLocation;
    } else if (eventDTO.eventType === EventTypes.privateEvent) {
      const privateEvent = eventDTO as PrivateEventTokenDTO;

      startTime = privateEvent.startTime;
      endTime = privateEvent.endTime;
      eventDate = privateEvent.eventDate;
      eventLocation = privateEvent.eventLocation;
    }

    eventDetails.eventTime = this.dateTimeService.processApiTimeRangeResponse(
      startTime,
      endTime
    );

    eventDetails.eventDate =
      this.dateTimeService.processApiDateResponse(eventDate);

    eventDetails.eventLocation =
      await this.geoLocationService.retrieveLocationCityDistrict(eventLocation);

    this.bookingDetails.eventDetails = { ...eventDetails };

    let providerDetails: ProviderDetails = {} as ProviderDetails;
    const serviceProvider = this.profileBooking.serviceProvider;
    const providerDTO: ProfileDTO =
      this.profileMapperService.serviceProviderToProfileDTO(serviceProvider);

    const providerImage = providerDTO.profileImage;
    const defaultProfileImage = this.profileImageService.defaultProfileImage(
      providerDTO.profile as Profiles
    );
    const profileImage = providerImage
      ? `url(${providerImage}) center center / contain no-repeat`
      : defaultProfileImage;
    providerDetails.profileImage = profileImage;
    providerDetails.profileName = providerDTO.profileName;

    const providerLocation = serviceProvider.profileLocation;
    providerDetails.profileLocation =
      await this.geoLocationService.retrieveLocationCityDistrict(
        providerLocation
      );

    const businessProfile: BusinessProfileDTO = serviceProvider.businessProfile;
    const businessProfileDetails: BusinessProfileDetails =
      this.profileProcessor.processBusinessProfile(businessProfile);
    providerDetails = {
      ...providerDetails,
      ...businessProfileDetails,
    };

    this.bookingDetails.providerDetails = { ...providerDetails };

    // Might not be needed. Please review
    this.bookingStatus = this.profileBooking.bookingStatus as RequestStatus;

    if (this.profileBooking.invoice) {
      this.bookingInvoice = this.profileBooking.invoice;
      this.bookingDetails.invoiceTotal = this.bookingInvoice.amountInCents;

      this.invoiceStatus = this.bookingInvoice.invoiceStatus as InvoiceStatus;
      const invoiceStatusOptions = ProfileRevenueConstants.InvoiceStatusOptions;

      Object.entries(InvoiceStatus).forEach(([key, value]) => {
        if (value === this.invoiceStatus) {
          this.bookingDetails.invoiceStatus =
            invoiceStatusOptions[key as keyof typeof invoiceStatusOptions];
        }
      });
    }
  }
}
