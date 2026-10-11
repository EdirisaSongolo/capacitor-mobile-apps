import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Device } from '@domain-data-models/app-domain.enums';
import { BreakPointService } from '@domain-services/index';
import { BookingTokenDTO } from '@profile-revenue-core/api';
import {
  managedInvoicesSelector,
  retrieveUserManagedInvoices,
} from '@profile-revenue-core/store';

import { Router } from '@angular/router';
import { UserAccountRoutes } from '@user-profile-core/data-models/user-account.routes';

@Component({
  selector: 'Tsk-managed-booking-invoices',
  templateUrl: './managed-booking-invoices.component.html',
  styleUrls: ['./managed-booking-invoices.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ManagedBookingInvoicesComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public managedInvoices: BookingTokenDTO[] = [];

  private managedInvoices$: Observable<BookingTokenDTO[]> = this.store.select(
    managedInvoicesSelector
  );
  private breakPoint$: Observable<Device> = this.breakPoint.deviceObservable;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakPoint: BreakPointService,
    private store: Store,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const breakpointSub = this.breakPoint$.subscribe(device => {
      this.device = device;
    });

    this.subscriptions.add(breakpointSub);

    const managedInvoicesSub = this.managedInvoices$.subscribe(
      managedInvoices => {
        if (managedInvoices.length >= 1) {
          this.managedInvoices = [...managedInvoices];
        }
      }
    );

    this.subscriptions.add(managedInvoicesSub);

    this.store.dispatch(retrieveUserManagedInvoices());
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayInvoiceDetails(bookingToken: BookingTokenDTO): void {
    this.router.navigate([
      `${UserAccountRoutes.HOME}/${UserAccountRoutes.BOOKING_INVOICE}`,
      bookingToken.bookingId,
    ]);
  }
}
