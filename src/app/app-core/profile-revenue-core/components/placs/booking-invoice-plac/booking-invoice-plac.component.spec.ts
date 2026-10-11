import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { BookingInvoicePlacComponent } from './booking-invoice-plac.component';

describe('BookingInvoicePlacComponent', () => {
  let component: BookingInvoicePlacComponent;
  let fixture: ComponentFixture<BookingInvoicePlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [BookingInvoicePlacComponent] });

    fixture = TestBed.createComponent(BookingInvoicePlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
