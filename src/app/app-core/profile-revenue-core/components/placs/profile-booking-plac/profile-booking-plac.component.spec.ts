import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileBookingPlacComponent } from './profile-booking-plac.component';

describe('ProfileBookingPlacComponent', () => {
  let component: ProfileBookingPlacComponent;
  let fixture: ComponentFixture<ProfileBookingPlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [ProfileBookingPlacComponent] });

    fixture = TestBed.createComponent(ProfileBookingPlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
