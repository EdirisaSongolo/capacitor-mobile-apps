import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ManagedBookingInvoicesComponent } from './managed-booking-invoices.component';

describe('UserActionsComponent', () => {
  let component: ManagedBookingInvoicesComponent;
  let fixture: ComponentFixture<ManagedBookingInvoicesComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [ManagedBookingInvoicesComponent],
    });

    fixture = TestBed.createComponent(ManagedBookingInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
