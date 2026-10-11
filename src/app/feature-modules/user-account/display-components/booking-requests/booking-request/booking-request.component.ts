import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BreakPointService } from '@domain-services/break-point/break-point.service';
import {
  AppResponseType,
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
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';

import {
  BookingResponseDTO,
  EventRefenceDTO,
  InvoiceDTO,
  ManageBookingDTO,
  ProfileBookingDTO,
} from '@profile-revenue-core/api';

import {
  cancelBookingRequest,
  confirmBookingRequest,
  declineBookingRequest,
  profileBookingSelector,
  retrieveBookingRequestDetails,
} from '@profile-revenue-core/store';
import {
  BookingDetails,
  InvoiceStatus,
  ProfileRevenueConstants,
} from '@profile-revenue-core/data-models';
import { UserAccountRoutes } from '@user-profile-core/data-models/user-account.routes';
import { PublicEventTokenDTO } from '@public-events-core/api';
import { PrivateEventTokenDTO } from '@private-events-core/api';
import { BusinessProfileDTO } from '@profile-accounts-core/api';

import {
  BusinessProfileDetails,
  ProviderDetails,
} from '@profile-accounts-core/data-models';
import { ProfileProcessorService } from '@profile-accounts-core/services/profile-processors/profile-processor.service';
import { ProfileImageService } from '@media-core/services';
import { ProfileMapperService } from '@profile-accounts-core/services';
import { UserEventMapperService } from '@domain-services/mappers';

@Component({
  selector: 'Tsk-booking-request',
  templateUrl: './booking-request.component.html',
  styleUrls: ['./booking-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BookingRequestComponent implements OnInit, OnDestroy {
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
  public response: RequestStatus = RequestStatus.confirmed;
  public requestOptions: typeof RequestStatus = RequestStatus;
  public requestStatus: RequestStatus = RequestStatus.pending;

  public invoiceForm: FormGroup = this.formBuilder.group({
    invoiceTotal: ['', Validators.required],
  });

  public bookingInvoice: InvoiceDTO;
  public invoiceStatus: string;
  public statement: string;
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
    private formBuilder: FormBuilder,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private geoLocationService: GeoLocationService,
    private dateTimeService: DateTimeService,
    private appResponseService: AppResponseService,
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

  public bookingResponse(response: RequestStatus) {
    this.response =
      response === this.requestOptions.declined
        ? this.requestOptions.declined
        : this.requestOptions.confirmed;
  }

  public profileBookingResponse(requestResponse: RequestStatus): void {
    const bookingResponse: BookingResponseDTO = {
      bookingId: this.profileBooking.bookingId,
      requestResponse: requestResponse,
    };
    if (requestResponse === RequestStatus.confirmed) {
      if (this.invoiceForm.invalid) {
        const errors: string[] = [
          'profile-revenue.form-errors.add-invoice-total',
        ];
        this.appResponseService.createAppResponse(
          AppResponseType.warning,
          errors
        );
        return;
      }

      const formValues = this.invoiceForm.value;
      const invoiceAmount: number = formValues.invoiceTotal;
      const amountInCents: number = invoiceAmount;
      bookingResponse.amountInCents = amountInCents;
      this.store.dispatch(
        confirmBookingRequest({
          resourceReference: this.componentResource,
          bookingResponse: bookingResponse,
        })
      );
    }

    if (requestResponse === RequestStatus.declined) {
      this.store.dispatch(
        declineBookingRequest({
          resourceReference: this.componentResource,
          bookingResponse: bookingResponse,
        })
      );
    }

    if (requestResponse === RequestStatus.cancelled) {
      this.confirmationDialog = true;
    }
  }

  public displayBookingResponseOptions(): void {
    this.requestStatus = RequestStatus.pending;
    this.response = RequestStatus.confirmed;
  }

  public propateDialogAction(dialogAction: DialogAction): void {
    if (dialogAction === DialogAction.confirmed) {
      this.cancelBookingRequest();
    }
    this.confirmationDialog = false;
  }

  private cancelBookingRequest(): void {
    const providerReference: ProfileDTO =
      this.profileMapperService.serviceProviderToProfileDTO(
        this.profileBooking.serviceProvider
      );

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

    if (this.profileBooking.bookingStatus !== this.requestOptions.pending) {
      this.requestStatus = this.profileBooking.bookingStatus as RequestStatus;
      if (this.requestStatus === RequestStatus.confirmed) {
        this.statement =
          'profile-revenue.profile-booking.booking-status.confirmed';
      } else if (this.requestStatus === RequestStatus.declined) {
        this.statement =
          'profile-revenue.profile-booking.booking-status.declined';
      } else if (this.requestStatus === RequestStatus.cancelled) {
        this.statement =
          'profile-revenue.profile-booking.booking-status.cancelled';
      }
    }

    if (this.profileBooking.invoice) {
      this.bookingInvoice = this.profileBooking.invoice;
      this.bookingDetails.invoiceTotal =
        this.bookingInvoice.amountInCents / 100;

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
