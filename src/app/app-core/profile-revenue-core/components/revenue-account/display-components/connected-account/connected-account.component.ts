import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import { ProfileDTO } from '@app-core/app-api';
import { BreakPointService } from '@domain-services/index';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import {
  DirectDepositDTO,
  ConnectedAccountDTO,
  RevenueAccountDTO,
} from '@profile-revenue-core/api/profile-revenue.dto-models';
import {
  revenueAccountSelector,
  retrieveRevenueAccount,
  updateConnectedAccount,
} from '@profile-revenue-core/store';

@Component({
  selector: 'Tsk-connected-account',
  templateUrl: './connected-account.component.html',
  styleUrls: ['./connected-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ConnectedAccountComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public profileDTO: ProfileDTO;
  @ViewChild('direct_deposit_dialog')
  directDepositDialog!: ElementRef<HTMLDivElement>;

  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public controlIcon: string = 'edit';
  public closeIcon: string = 'remove';

  public editDirectDeposit: boolean = false;
  public accountOnFile: boolean = false;

  public accountName: string;
  public accountNumber: string;
  public directDepositFormFields: any[] = [
    {
      label: 'profile-revenue.revenue-account.connected-account.account-name',
      type: 'text',
      control: 'accountName',
    },
    {
      label: 'profile-revenue.revenue-account.connected-account.account-number',
      type: 'text',
      control: 'accountNumber',
      mask: '0*',
      max: 17,
    },
    {
      label:
        'profile-revenue.revenue-account.connected-account.confirm-account-number',
      type: 'text',
      control: 'confirmAccountNumber',
      mask: '0*',
      max: 17,
    },
    {
      label: 'profile-revenue.revenue-account.connected-account.routing-number',
      type: 'text',
      control: 'routingNumber',
      mask: '0*',
      max: 9,
    },
    {
      label:
        'profile-revenue.revenue-account.connected-account.confirm-routing-number',
      type: 'text',
      control: 'confirmRoutingNumber',
      mask: '0*',
      max: 9,
    },
  ];

  public directDepositForm: FormGroup = this.formBuilder.group({
    accountName: ['', Validators.required],
    accountNumber: ['', Validators.required],
    confirmAccountNumber: ['', Validators.required],
    routingNumber: ['', Validators.required],
    confirmRoutingNumber: ['', Validators.required],
  });

  private revenueAccount: RevenueAccountDTO;
  private revenueAccount$: Observable<RevenueAccountDTO> = this.store.select(
    revenueAccountSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private formBuilder: FormBuilder,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const revenueAccountSub = this.revenueAccount$.subscribe(revenueAccount => {
      if (revenueAccount) {
        this.revenueAccount = { ...revenueAccount };
        this.processRevenueAccount(this.revenueAccount);
        this.closeDialog();
      }
    });

    this.subscriptions.add(revenueAccountSub);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const profileDTOChanges = changes['profileDTO'];
    if (profileDTOChanges?.currentValue) {
      this.profileDTO = profileDTOChanges.currentValue;
      this.store.dispatch(
        retrieveRevenueAccount({ profileDTO: this.profileDTO })
      );
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayDirectDepositDialog(): void {
    this.editDirectDeposit = !this.editDirectDeposit;
  }

  public componentClickEvent(event: MouseEvent): void {
    const depositDialogClick = this.directDepositDialog?.nativeElement.contains(
      event.target as Node
    );

    if (!depositDialogClick) {
      this.closeDialog();
    }
  }

  public submitDirectDepositAccount(): void {
    if (this.directDepositForm.invalid) {
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        'common-errors.required-fields',
      ]);
      return;
    }

    const formValues = this.directDepositForm.value;
    const messages: string[] = [];

    if (formValues.accountNumber !== formValues.confirmAccountNumber) {
      messages.push(
        'profile-revenue.revenue-account.connected-account.form-errors.account-number-mismatch'
      );
    }

    if (formValues.routingNumber !== formValues.confirmRoutingNumber) {
      messages.push(
        'profile-revenue.revenue-account.connected-account.form-errors.routing-number-mismatch'
      );
    }

    if (messages.length) {
      this.appResponseService.createAppResponse(
        AppResponseType.warning,
        messages
      );
      return;
    }

    const directDeposit: DirectDepositDTO = {
      revenueAccountId: this.revenueAccount.revenueAccountId,
      accountName: formValues.accountName,
      accountNumber: formValues.accountNumber,
      routingNumber: formValues.routingNumber,
    };

    this.store.dispatch(
      updateConnectedAccount({ directDeposit: directDeposit })
    );
  }

  private processRevenueAccount(revenueAccount: RevenueAccountDTO): void {
    const connectedAccount: ConnectedAccountDTO =
      revenueAccount.connectedAccount;
    if (connectedAccount.accountName && connectedAccount.accountNumber) {
      this.accountOnFile = true;
      this.accountName = connectedAccount.accountName;
      this.accountNumber = connectedAccount.accountNumber;
    }
  }

  public closeDialog(): void {
    if (this.editDirectDeposit) {
      this.editDirectDeposit = false;
    }
  }
}
