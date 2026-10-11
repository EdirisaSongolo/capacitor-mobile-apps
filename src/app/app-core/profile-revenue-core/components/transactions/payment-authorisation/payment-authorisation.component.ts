import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { Device } from '@domain-data-models/app-domain.enums';

import {
  CardOnFileDTO,
  CustomerAccountDTO,
  PaymentRequestDTO,
  PaymentIntentDTO,
  PaymentTransactionDTO,
  TransactionCustomer,
} from '@profile-revenue-core/api';

import { TransactionDetails } from '@profile-revenue-core/data-models';

import {
  createPaymentRequest,
  paymentRequestSelector,
} from '@profile-revenue-core/store';

enum PaymentDisplay {
  transaction_details = 'TRANSACTION_DETAILS',
  payment_options = 'PAYMENT_OPTIONS',
}

@Component({
  selector: 'Tsk-payment-authorisation',
  templateUrl: './payment-authorisation.component.html',
  styleUrls: ['./payment-authorisation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PaymentAuthorisationComponent
  implements OnInit, OnChanges, OnDestroy
{
  @ViewChild('payment_dialog') public paymentDialog: ElementRef<HTMLDivElement>;
  @Input() public paymentIntent: PaymentIntentDTO;
  @Input() public transactionDetails: TransactionDetails;
  @Output() public closeDialog: EventEmitter<void> = new EventEmitter();
  @Output() public submitTransaction: EventEmitter<PaymentTransactionDTO> =
    new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public paymentDisplay: PaymentDisplay = PaymentDisplay.transaction_details;
  public displayOptions: typeof PaymentDisplay = PaymentDisplay;
  public closeIcon: string = 'remove';
  public optionsIcon: string = 'compare_arrows';
  public backIcon: string = 'keyboard_backspace';

  public receiptDetails: any = {};
  public paymentRequest: PaymentRequestDTO;
  public customerAccount: CustomerAccountDTO;
  public validPayment: boolean = false;
  public paymentCard: CardOnFileDTO;

  private paymentRequest$: Observable<PaymentRequestDTO> = this.store.select(
    paymentRequestSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,

    private translator: TranslateService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const paymentRequestSub = this.paymentRequest$.subscribe(paymentRequest => {
      if (paymentRequest) {
        this.paymentRequest = { ...paymentRequest };
        this.processPaymentRequest(this.paymentRequest);
      }
    });

    this.subscriptions.add(paymentRequestSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const paymentIntent = changes['paymentIntent'];
    const transactionDetails = changes['transactionDetails'];

    if (paymentIntent?.currentValue && transactionDetails?.currentValue) {
      this.store.dispatch(
        createPaymentRequest({ paymentIntent: this.paymentIntent })
      );
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public closePaymentDialog(): void {
    this.closeDialog.emit();
  }

  public submitPaymentTransaction(): void {
    const customerAccount = this.paymentRequest.customerAccount;
    const transactionCustomer: TransactionCustomer = {
      userProfileId: customerAccount.userProfileId,
      stripeCustomerId: customerAccount.stripeCustomerId,
      stripeCardId: this.paymentCard.stripeCardId,
      cardLastFour: this.paymentCard.cardLastFour,
    };

    const paymentTransactionDTO: PaymentTransactionDTO = {
      transactionReference: this.transactionDetails.transactionReference,
      transactionReferenceId: this.transactionDetails.transactionReferenceId,
      currency: this.paymentRequest.currency,
      amountInCents: this.paymentRequest.amountInCents,
      serviceFeeInCents: this.paymentRequest.serviceFeeInCents,
      grossAmountInCents: this.paymentRequest.grossAmountInCents,
      merchantAccount: this.paymentRequest.merchantAccount,
      customerAccount: transactionCustomer,
      transactionMetaData: this.transactionDetails.transactionMetaData,
    };

    this.submitTransaction.emit(paymentTransactionDTO);
  }

  public displayTransactionDetails(): void {
    this.paymentDisplay = PaymentDisplay.transaction_details;
  }

  public displayPaymentOptions(): void {
    this.paymentDisplay = PaymentDisplay.payment_options;
  }

  public refreshPaymentRequest(): void {
    this.store.dispatch(
      createPaymentRequest({ paymentIntent: this.paymentIntent })
    );
    this.displayTransactionDetails();
  }

  private processPaymentRequest(paymentRequest: PaymentRequestDTO): void {
    this.receiptDetails.amountInCents = paymentRequest.amountInCents;
    this.receiptDetails.serviceFeeInCents = paymentRequest.serviceFeeInCents;
    this.receiptDetails.grossAmountInCents = paymentRequest.grossAmountInCents;

    this.customerAccount = paymentRequest.customerAccount;
    const cardsOnFile: CardOnFileDTO[] = this.customerAccount.cardsOnFile;
    if (cardsOnFile?.length >= 1) {
      this.validPayment = true;
      this.optionsIcon = 'compare_arrows';

      const endingIn = this.translator.instant(
        'profile-revenue.transactions.ending-in'
      );

      const preferredCard = cardsOnFile.find(card => card.preferred);
      this.paymentCard = preferredCard ?? cardsOnFile[0];
      this.receiptDetails.preferredPayment = `${this.paymentCard.cardBrand} ${endingIn} ${this.paymentCard.cardLastFour}`;
    } else {
      this.receiptDetails.preferredPayment =
        'profile-revenue.transactions.no-valid-payment';
      this.validPayment = false;
      this.optionsIcon = 'add';
    }
  }
}
