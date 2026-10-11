import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ManagedBookingRequestsComponent } from './managed-booking-requests.component';

describe('ProfileBookingComponent', () => {
  let component: ManagedBookingRequestsComponent;
  let fixture: ComponentFixture<ManagedBookingRequestsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [ManagedBookingRequestsComponent],
    });

    fixture = TestBed.createComponent(ManagedBookingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
