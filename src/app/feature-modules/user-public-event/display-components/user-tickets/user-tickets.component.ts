import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  ComponentAction,
  Device,
  EventTypes,
  Profiles,
} from '@domain-data-models/app-domain.enums';
import { BreakPointService, DateTimeService } from '@domain-services/index';
import { LocationMappersService } from '@domain-services/mappers';
import { ProfileDTO } from '@app-core/app-api';
import { ProfileMapperService } from '@profile-accounts-core/services';
import {
  TransactionDetails,
  TransactionReference,
} from '@profile-revenue-core/data-models';
import {
  EventComponentDTO,
  EventDetailsDTO,
  PublicEventDateDTO,
  UserPublicEventDTO,
  UserTicketsDTO,
} from '@public-events-core/api';
import {
  purchasePublicEventTickets,
  retrieveUserPublicEvent,
  userPublicEventSelector,
} from '@public-events-core/store';
import { UserTokenDTO } from '@user-profile-core/api';
import { UserProfileRoutes } from '@user-profile-core/data-models';
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
  PublicEventConstants,
} from '@public-events-core/data-models';
import { setComponentAction, setProfileDTO } from '@app-domain/store';

@Component({
  selector: 'Tsk-user-tickets',
  templateUrl: './user-tickets.component.html',
  styleUrls: ['./user-tickets.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserTicketsComponent {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public profileImage: string = `${PublicEventConstants.DEFAULT_PROFILE_IMAGE} center center / contain no-repeat`;
  public eventName: string;
  public eventDate: string;
  public eventTime: string;
  public venueAddress: string;

  public publicEventDate: PublicEventDateDTO;

  public ticketControls: string = 'add';
  public userTickets: UserTicketsDTO[] = [];
  public eventTickets: Map<string, number> = new Map();
  public salesDialog: boolean = false;
  public paymentDialog: boolean = false;
  public paymentIntent: PaymentIntentDTO;
  public transactionDetails: TransactionDetails;

  private userPublicEvent: UserPublicEventDTO;
  private eventDetails: EventDetailsDTO;
  private eventPrincipal: ServiceProviderDTO;

  private eventComponent: EventComponentDTO;

  private userPublicEvent$: Observable<UserPublicEventDTO> = this.store.select(
    userPublicEventSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private translateService: TranslateService,
    private dateTimeService: DateTimeService,
    private profileMapperService: ProfileMapperService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const userPublicEventSub = this.userPublicEvent$.subscribe(
      userPublicEvent => {
        if (userPublicEvent) {
          this.userPublicEvent = userPublicEvent;

          this.eventComponent = {
            component: EventComponents.event_date,
            componentId: userPublicEvent.eventDateId,
          };

          this.processUserPublicEvent(this.userPublicEvent);
        }
      }
    );

    this.subscriptions.add(userPublicEventSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public closeDialogs(): void {
    this.salesDialog = false;
    this.paymentDialog = false;
  }

  public createTicketSales(): void {
    this.salesDialog = !this.salesDialog;
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

  private processUserPublicEvent(userPublicEvent: UserPublicEventDTO): void {
    this.eventDetails = userPublicEvent.eventDetails;
    this.eventName = this.eventDetails.eventName;

    if (this.eventDetails?.profileImage) {
      const imagePath = this.eventDetails.profileImage;
      this.profileImage = `url(${imagePath}) center center / contain no-repeat`;
    }

    this.userTickets = userPublicEvent.userTickets;

    const publicEventDate = userPublicEvent.publicEventDate;
    this.publicEventDate = { ...publicEventDate };

    this.eventDate = this.dateTimeService.processApiDateResponse(
      this.publicEventDate.eventDate
    );

    this.eventTime = this.dateTimeService.processApiTimeRangeResponse(
      this.publicEventDate.startTime,
      this.publicEventDate.endTime
    );

    const eventTickets = this.publicEventDate.eventTickets;
    Object.entries(eventTickets)
      .sort(([a_key, a_value], [b_key, b_value]) => a_value - b_value)
      .forEach(([key, value]) => {
        this.eventTickets.set(key, value as number);
      });

    const publicEventPrincipal = userPublicEvent.publicEventPrincipal;
    this.eventPrincipal = publicEventPrincipal.principalProfile;
  }
}
