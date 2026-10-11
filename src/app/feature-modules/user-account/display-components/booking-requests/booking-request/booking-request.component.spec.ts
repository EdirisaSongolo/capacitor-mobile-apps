import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { BookingRequestComponent } from './booking-request.component';

describe('BookingRequestComponent', () => {
  let component: BookingRequestComponent;
  let fixture: ComponentFixture<BookingRequestComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [BookingRequestComponent] });

    fixture = TestBed.createComponent(BookingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
