import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { KeyValue } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  AppResponseType,
  Device,
  Profiles,
  UserEventAccess,
} from '@domain-data-models/app-domain.enums';
import {
  AppResponseService,
  BreakPointService,
  DateTimeService,
} from '@domain-services/index';
import { LocationMappersService } from '@domain-services/mappers';
import { ProfileDTO } from '@app-core/app-api';
import { AuthService } from '@auth-core/auth-service';
import { ProfileMapperService } from '@profile-accounts-core/services';

import {
  TransactionDetails,
  TransactionReference,
} from '@profile-revenue-core/data-models';
import {
  EventComponentDTO,
  EventDateProfileDTO,
  EventDetailsDTO,
  PublicEventDateDTO,
} from '@public-events-core/api';

import {
  eventDateProfileSelector,
  purchasePublicEventTickets,
  retrieveEventDateProfile,
  savePublicEventDate,
} from '@public-events-core/store';
import { UserTokenDTO } from '@user-profile-core/api';
import {
  UserAccountRoutes,
  UserProfileRoutes,
} from '@user-profile-core/data-models';
import { VendorTokenDTO } from '@vendors-core/api';
import { VendorsRoutes } from '@vendors-core/data-models';
import { VenueTokenDTO } from '@venues-core/api';
import { VenuesRoutes } from '@venues-core/data-models/venues.routes';
import { ServiceProviderDTO } from '@profile-accounts-core/api';
import {
  PaymentIntentDTO,
  PaymentTransactionDTO,
  TransactionMetaData,
} from '@profile-revenue-core/api';
import {
  EventComponents,
  PublicEventRoutes,
} from '@public-events-core/data-models';

@Component({
  selector: 'Tsk-public-event-profile-date-details',
  templateUrl: './public-event-profile-date-details.component.html',
  styleUrls: ['./public-event-profile-date-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PublicEventProfileDateDetailsComponent
  implements OnInit, OnDestroy
{
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;
  public profileOptions: typeof Profiles = Profiles;

  public saveDate: string = 'bookmark';
  public buyTickets: string = 'confirmation_number';
  public userEvent: boolean = false;
  public ticketedEvent: boolean = false;

  public publicEventDate: PublicEventDateDTO;
  public venueToken: VenueTokenDTO;

  public venueAddress: string;
  public eventDate: string;
  public eventTime: string;
  public eventTickets: Map<string, number> = new Map();
  public dateFeatures: ServiceProviderDTO[] = [];

  public salesDialog: boolean = false;

  public paymentDialog: boolean = false;
  public paymentIntent: PaymentIntentDTO;
  public transactionDetails: TransactionDetails;

  private eventComponent: EventComponentDTO;
  private eventPrincipal: ServiceProviderDTO;
  private eventDetails: EventDetailsDTO;
  private authenticated: boolean = false;

  private eventDateProfile$: Observable<EventDateProfileDTO> =
    this.store.select(eventDateProfileSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private locationMappers: LocationMappersService,
    private dateTimeService: DateTimeService,
    private profileMapperService: ProfileMapperService,
    private appResponseService: AppResponseService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const authSub = this.authService.userAuthenicated$.subscribe(
      authenticated => {
        this.authenticated = authenticated;
      }
    );

    this.subscriptions.add(authSub);

    const routerParamSub = this.activatedRoute.paramMap.subscribe(
      parameters => {
        const eventDateId = parameters.get(PublicEventRoutes.EVENT_DATE_ID);
        this.eventComponent = {
          component: EventComponents.event_date,
          componentId: eventDateId,
        };

        this.store.dispatch(
          retrieveEventDateProfile({ eventComponent: this.eventComponent })
        );
      }
    );

    this.subscriptions.add(routerParamSub);

    const eventDateProfileSub = this.eventDateProfile$.subscribe(
      eventDateProfile => {
        if (eventDateProfile) {
          this.processEventDateProfile(eventDateProfile);
        }
      }
    );

    this.subscriptions.add(eventDateProfileSub);
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

  public venueProfilePage(venue: VenueTokenDTO): void {
    this.router.navigate([VenuesRoutes.VENUE_PROFILE, venue.venueProfileId]);
  }

  public serviceProviderProfilePage(
    profile: Profiles,
    serviceProvider: ServiceProviderDTO
  ): void {
    if (profile === this.profileOptions.userProfile) {
      const userProfile = serviceProvider as UserTokenDTO;
      this.router.navigate([
        UserProfileRoutes.USER_PROFILE,
        userProfile.userProfileId,
      ]);
    } else if (profile === this.profileOptions.vendorProfile) {
      const vendorProfile = serviceProvider as VendorTokenDTO;
      this.router.navigate([
        VendorsRoutes.VENDOR_PROFILE,
        vendorProfile.vendorProfileId,
      ]);
    }
  }

  public sortTickets(
    a: KeyValue<string, number>,
    b: KeyValue<string, number>
  ): number {
    return a.value - b.value;
  }

  public savePublicEventDate(): void {
    if (!this.authenticated) {
      this.redirectToLogin('public-event-profile.save-date.login-required');
      return;
    }

    if (!this.userEvent) {
      this.store.dispatch(
        savePublicEventDate({ eventDate: this.eventComponent })
      );
      this.userEvent = true;
    }
  }

  public createTicketSales(): void {
    if (!this.authenticated) {
      this.redirectToLogin('public-event-profile.ticket-sales.login-required');
      return;
    }

    if (this.ticketedEvent) {
      this.router.navigate([
        UserAccountRoutes.USER_PUBLIC_EVENT,
        this.publicEventDate.dateId,
      ]);
      return;
    }

    this.salesDialog = !this.salesDialog;
  }

  public closeDialogs(): void {
    this.salesDialog = false;
    this.paymentDialog = false;
  }

  public processTicketSales(transactionMetaData: TransactionMetaData[]) {
    this.salesDialog = false;

    const merchantProfile: ProfileDTO =
      this.profileMapperService.serviceProviderToProfileDTO(
        this.eventPrincipal
      );

    const amountInCents: number = transactionMetaData.reduce(
      (amountInCents, metaData) => amountInCents + metaData.total,
      0
    );

    this.paymentIntent = {
      merchantProfile: merchantProfile,
      amountInCents: amountInCents,
      currency: 'usd',
    };

    const profileImage = `url(${this.eventDetails.profileImage}) center / contain no-repeat`;
    const date = this.publicEventDate.eventDate;
    const receiptName = this.translateService.instant(
      'public-event-profile.ticket-sales.header'
    );

    this.transactionDetails = {
      transactionReference: TransactionReference.public_event_tickets,
      transactionReferenceId: this.publicEventDate.dateId,
      receiptImage: profileImage,
      receiptHeader: this.eventDetails.eventName,
      referenceDate: this.dateTimeService.processApiDateResponse(date),
      referenceTime: this.dateTimeService.processApiTimeRangeResponse(
        this.publicEventDate.startTime,
        this.publicEventDate.endTime
      ),
      receiptName: receiptName,
      transactionMetaData: [...transactionMetaData],
    };

    this.paymentDialog = true;
  }

  public submitTicketPayment(paymentTransaction: PaymentTransactionDTO): void {
    this.store.dispatch(
      purchasePublicEventTickets({
        paymentTransaction: paymentTransaction,
        eventComponent: this.eventComponent,
      })
    );
    this.paymentDialog = false;
  }

  private redirectToLogin(message: string): void {
    this.appResponseService.createAppResponse(AppResponseType.warning, [
      message,
    ]);
    this.router.navigate(['/auth'], {
      queryParams: { returnUrl: this.router.url },
    });
  }

  private processEventDateProfile(eventDateProfile: EventDateProfileDTO): void {
    const publicEventDate = eventDateProfile.publicEventDate;
    this.publicEventDate = { ...publicEventDate };
    this.venueToken = this.publicEventDate.dateVenue;

    const locationDTO = this.venueToken.venueLocation;
    if (locationDTO?.address) {
      this.venueAddress =
        this.locationMappers.mapLocationDTOAddress(locationDTO);
    }

    this.eventDate = this.dateTimeService.processApiDateResponse(
      this.publicEventDate.eventDate
    );

    this.eventTime = this.dateTimeService.processApiTimeRangeResponse(
      this.publicEventDate.startTime,
      this.publicEventDate.endTime
    );

    const dateFeatures = this.publicEventDate?.dateFeatures;
    if (dateFeatures && dateFeatures.length >= 1) {
      this.dateFeatures = [...dateFeatures];
    }

    const eventTickets = this.publicEventDate.eventTickets;
    Object.entries(eventTickets)
      .sort(([a_key, a_value], [b_key, b_value]) => a_value - b_value)
      .forEach(([key, value]) => {
        this.eventTickets.set(key, value as number);
      });

    this.eventDetails = eventDateProfile.eventDetails;

    const userEventStatus = eventDateProfile.userEventStatus;
    if (
      userEventStatus === UserEventAccess.saved ||
      userEventStatus === UserEventAccess.ticketed
    ) {
      this.userEvent = true;
    }

    if (userEventStatus === UserEventAccess.ticketed) {
      this.ticketedEvent = true;
    }

    const publicEventPrincipal = eventDateProfile.publicEventPrincipal;
    this.eventPrincipal = publicEventPrincipal.principalProfile;
  }
}
