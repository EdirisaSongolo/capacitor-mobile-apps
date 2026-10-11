import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VenueProfileDashboardComponent } from './venue-profile-dashboard.component';

describe('VenueProfileDashboardComponent', () => {
  let component: VenueProfileDashboardComponent;
  let fixture: ComponentFixture<VenueProfileDashboardComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [VenueProfileDashboardComponent],
    });

    fixture = TestBed.createComponent(VenueProfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
