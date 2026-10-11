import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { filter, firstValueFrom, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from '@environments/environment';

import {
  loadStripe,
  Stripe,
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
  StripeElements,
} from '@stripe/stripe-js';

import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import {
  AppResponseService,
  BreakPointService,
  ThemeService,
} from '@domain-services/index';
import {
  cardOnFileRequestSelector,
  createCardOnFileRequest,
  customerAccountSelector,
  paymentMethodsSelector,
  retrieveCustomerAccount,
  storePaymentMethods,
  updatePreferredPaymentMethod,
} from '@profile-revenue-core/store';

import {
  CardOnFileDTO,
  CardOnFileRequestDTO,
  CustomerAccountDTO,
} from '@profile-revenue-core/api';
import { CardBrand } from '@profile-revenue-core/data-models';

enum PaymentsDisplay {
  payment_methods = 'PAYMENT_METHODS',
  add_payment_method = 'ADD_PAYMENT_METHOD',
}

@Component({
  selector: 'Tsk-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PaymentMethodsComponent implements OnInit, OnDestroy {
  @ViewChild('cardNumber') cardNumberRef!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryRef!: ElementRef;
  @ViewChild('cardCvc') cardCvcRef!: ElementRef;

  @Output() public paymentAction: EventEmitter<void> = new EventEmitter();

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public paymentsDisplay: PaymentsDisplay = PaymentsDisplay.payment_methods;
  public displayOptions: typeof PaymentsDisplay = PaymentsDisplay;

  public cardsOnFile: CardOnFileDTO[] = [];
  public preferredIcon: string = 'check';
  public creditCard: string = 'credit_card';
  public cardBrandIcons: Record<string, string> = {
    [CardBrand.visa]: 'visa-icon',
    [CardBrand.mastercard]: 'mastercard-icon',
    [CardBrand.amex]: 'amex-icon',
    [CardBrand.discover]: 'discover-icon',
  };

  private customerAccount: CustomerAccountDTO;
  private cardOnFileRequest: CardOnFileRequestDTO;
  private stripe: Stripe;
  private stripeElements: StripeElements;
  private cardNumber!: StripeCardNumberElement;
  private cardExpiry!: StripeCardExpiryElement;
  private cardCvc!: StripeCardCvcElement;
  private stripeKey: string = environment.stripeKey;

  private cardOnFileRequest$: Observable<CardOnFileRequestDTO> =
    this.store.select(cardOnFileRequestSelector);
  private paymentMethods$: Observable<CardOnFileDTO[]> = this.store.select(
    paymentMethodsSelector
  );
  private customerAccount$: Observable<CustomerAccountDTO> = this.store.select(
    customerAccountSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private appResponseService: AppResponseService,
    private themeService: ThemeService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    this.store.dispatch(retrieveCustomerAccount());

    const customerAccountSub = this.customerAccount$.subscribe(
      customerAccount => {
        if (customerAccount) {
          this.customerAccount = { ...customerAccount };
          this.processCustomerAccount(this.customerAccount);
        }
      }
    );

    this.subscriptions.add(customerAccountSub);

    const paymentMethodsSub = this.paymentMethods$.subscribe(paymentMethods => {
      if (paymentMethods) {
        this.cardsOnFile = paymentMethods;
      }
    });

    this.subscriptions.add(paymentMethodsSub);

    const themeSub = this.themeService.themeObservable.subscribe(() => {
      const stripeStyle = this.styleStripeElement();
      this.cardNumber?.update({ style: stripeStyle });
      this.cardExpiry?.update({ style: stripeStyle });
      this.cardCvc?.update({ style: stripeStyle });
    });

    this.subscriptions.add(themeSub);
  }

  public ngOnDestroy(): void {
    this.destroyStripeCardElements();
    this.subscriptions.unsubscribe();
  }

  public setPreferredPayment(cardOnFile: CardOnFileDTO): void {
    this.store.dispatch(
      updatePreferredPaymentMethod({ cardOnFile: cardOnFile })
    );
    this.paymentAction.emit();
    this.paymentsDisplay = PaymentsDisplay.payment_methods;
  }

  public async displayCardEntry(): Promise<void> {
    this.paymentsDisplay = PaymentsDisplay.add_payment_method;

    this.store.dispatch(createCardOnFileRequest());
    this.cardOnFileRequest = await firstValueFrom(
      this.cardOnFileRequest$.pipe(filter(value => value !== null))
    );

    const stripe = await loadStripe(this.stripeKey).catch(
      (): Stripe | null => null
    );

    if (!stripe) {
      this.appResponseService.createAppResponse(AppResponseType.error, [
        'profile-revenue.payment-methods.form-errors.card-entry-unavailable',
      ]);
      this.paymentsDisplay = PaymentsDisplay.payment_methods;
      return;
    }

    this.stripe = stripe;

    this.stripeElements = this.stripe.elements({
      clientSecret: this.cardOnFileRequest.clientSecret,
    });

    this.mountStripeCardElements();
  }

  public mountStripeCardElements(): void {
    if (
      !this.cardNumberRef?.nativeElement ||
      !this.cardExpiryRef?.nativeElement ||
      !this.cardCvcRef?.nativeElement
    ) {
      this.appResponseService.createAppResponse(AppResponseType.error, [
        'profile-revenue.payment-methods.form-errors.card-entry-unavailable',
      ]);
      this.paymentsDisplay = PaymentsDisplay.payment_methods;
      return;
    }

    this.cardNumber = this.stripeElements.create('cardNumber', {
      style: this.styleStripeElement(),
      showIcon: true,
      disableLink: true,
    });
    this.cardNumber.mount(this.cardNumberRef.nativeElement);

    this.cardExpiry = this.stripeElements.create('cardExpiry', {
      style: this.styleStripeElement(),
    });
    this.cardExpiry.mount(this.cardExpiryRef.nativeElement);

    this.cardCvc = this.stripeElements.create('cardCvc', {
      style: this.styleStripeElement(),
    });
    this.cardCvc.mount(this.cardCvcRef.nativeElement);
  }

  public async createCardOnFile(): Promise<void> {
    const { error: confirmError, setupIntent } =
      await this.stripe.confirmCardSetup(this.cardOnFileRequest.clientSecret, {
        payment_method: {
          card: this.cardNumber,
        },
      });

    if (confirmError) {
      this.appResponseService.createAppResponse(AppResponseType.error, [
        confirmError?.message,
      ]);
      return;
    }

    if (setupIntent?.status === 'succeeded') {
      this.destroyStripeCardElements();
      this.store.dispatch(retrieveCustomerAccount());
      this.paymentAction.emit();
      this.paymentsDisplay = PaymentsDisplay.payment_methods;
    }
  }

  private processCustomerAccount(customerAccount: CustomerAccountDTO): void {
    const cardsOnFile = customerAccount.cardsOnFile;
    this.store.dispatch(storePaymentMethods({ paymentMethods: cardsOnFile }));
  }

  private destroyStripeCardElements(): void {
    this.cardNumber?.destroy();
    this.cardExpiry?.destroy();
    this.cardCvc?.destroy();

    this.cardNumber = null;
    this.cardExpiry = null;
    this.cardCvc = null;
  }

  private styleStripeElement(): any {
    const rootStyles = getComputedStyle(document.documentElement);
    const foregroundColor = rootStyles
      .getPropertyValue('--tsk-foreground')
      .trim();

    return {
      base: {
        fontFamily: '"Roboto", sans-serif',
        fontSize: '16px',

        color: foregroundColor,
        lineHeight: '2rem',
        textAlign: 'center',
        '::placeholder': { color: '#828081', textAlign: 'center' },
        iconColor: foregroundColor,
      },
      invalid: {
        color: '#ff0000',
        iconColor: '#ff0000',
      },
    };
  }
}
