import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AppResponseType, Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/break-point/break-point.service';
import { RevenueAccountService } from '@profile-revenue-core/services/revenue-account.service';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import { profileDTOSelector } from '@app-domain/store';
import { ProfileDTO } from '@app-core/app-api';
import { RevenueAccountDTO } from '@profile-revenue-core/api';
import {
  retrieveRevenueAccount,
  revenueAccountSelector,
} from '@profile-revenue-core/store';
import {
  AccountOption,
  RevenueAccountStatus,
} from '@profile-revenue-core/data-models';

export interface SelectionOption {
  icon: string;
  title: string;
  description: string;
  option: AccountOption;
}

@Component({
  selector: 'Tsk-revenue-account',
  templateUrl: './revenue-account.component.html',
  styleUrls: ['./revenue-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RevenueAccountComponent implements OnInit {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public accountMain: boolean = true;
  public selectionOptions: SelectionOption[] = [];

  public businessDetails: boolean = false;
  public connectedAccount: boolean = false;

  private profileDTO: ProfileDTO;
  private revenueAccount: RevenueAccountDTO;

  private revenueAccount$: Observable<RevenueAccountDTO> = this.store.select(
    revenueAccountSelector
  );
  private profileDTO$: Observable<ProfileDTO> =
    this.store.select(profileDTOSelector);
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private accountService: RevenueAccountService,
    private appResponseService: AppResponseService
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const accountMainSub = this.accountService.accountMain$.subscribe(
      accountMain => {
        if (accountMain) {
          this.businessDetails = false;
          this.connectedAccount = false;

          this.accountMain = true;
          this.accountService.setAccountMain(false);
        }
      }
    );

    this.subscriptions.add(accountMainSub);

    const profileDTOSub = this.profileDTO$.subscribe(profileDTO => {
      if (profileDTO) {
        this.profileDTO = { ...profileDTO };
        this.store.dispatch(
          retrieveRevenueAccount({ profileDTO: this.profileDTO })
        );
      }
    });

    this.subscriptions.add(profileDTOSub);

    const revenueAccountSub = this.revenueAccount$.subscribe(revenueAccount => {
      if (revenueAccount?.revenueAccountId) {
        this.revenueAccount = { ...revenueAccount };
      }
    });

    this.subscriptions.add(revenueAccountSub);

    this.selectionOptions = this.populateSelectionOptions();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayAccountSetting(accountOption: AccountOption): void {
    if (
      !this.revenueAccount ||
      this.revenueAccount?.accountStatus === RevenueAccountStatus.in_active
    ) {
      const errorMessage: string =
        'profile-revenue.revenue-account.no-account-warning';
      this.appResponseService.createAppResponse(AppResponseType.warning, [
        errorMessage,
      ]);
      return;
    }

    if (accountOption === AccountOption.business_details) {
      this.accountMain = false;
      this.businessDetails = true;
    } else if (accountOption === AccountOption.connected_account) {
      this.accountMain = false;
      this.connectedAccount = true;
    }
  }

  private populateSelectionOptions(): SelectionOption[] {
    return [
      {
        icon: 'topic',
        title:
          'profile-revenue.revenue-account.selection-options.details-title',
        description:
          'profile-revenue.revenue-account.selection-options.details-description',
        option: AccountOption.business_details,
      },
      {
        icon: 'account_balance_wallet',
        title:
          'profile-revenue.revenue-account.selection-options.account-title',
        description:
          'profile-revenue.revenue-account.selection-options.account-description',
        option: AccountOption.connected_account,
      },
    ];
  }
}
