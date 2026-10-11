import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CreateUpdateBookingComponent } from './create-update-booking.component';

describe('CreateUpdateBookingComponent', () => {
  let component: CreateUpdateBookingComponent;
  let fixture: ComponentFixture<CreateUpdateBookingComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CreateUpdateBookingComponent] });

    fixture = TestBed.createComponent(CreateUpdateBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
