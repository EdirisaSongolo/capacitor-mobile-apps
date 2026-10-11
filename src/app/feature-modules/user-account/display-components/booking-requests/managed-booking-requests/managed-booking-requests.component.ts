import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { BreakPointService } from '@domain-services/index';
import { Device } from '@domain-data-models/app-domain.enums';

import { BookingTokenDTO } from '@profile-revenue-core/api';
import {
  managedBookingSelector,
  retrieveManagedBookingRequests,
} from '@profile-revenue-core/store';
import { UserAccountRoutes } from '@user-profile-core/data-models/user-account.routes';

@Component({
  selector: 'Tsk-managed-booking-requests',
  templateUrl: './managed-booking-requests.component.html',
  styleUrls: ['./managed-booking-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ManagedBookingRequestsComponent implements OnInit, OnDestroy {
  public device: Device = Device.desktop;
  public deviceTypes: typeof Device = Device;

  public managedBookingRequests: BookingTokenDTO[] = [];

  private managedBookingRequests$: Observable<BookingTokenDTO[]> =
    this.store.select(managedBookingSelector);
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

    const managedBookingSub = this.managedBookingRequests$.subscribe(
      profileBookingRequests => {
        this.managedBookingRequests = [...profileBookingRequests];
      }
    );

    this.subscriptions.add(managedBookingSub);

    this.store.dispatch(retrieveManagedBookingRequests());
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public displayProfileBooking(bookingToken: BookingTokenDTO): void {
    this.router.navigate([
      `${UserAccountRoutes.HOME}/${UserAccountRoutes.BOOKING_REQUEST}`,
      bookingToken.bookingId,
    ]);
  }
}
