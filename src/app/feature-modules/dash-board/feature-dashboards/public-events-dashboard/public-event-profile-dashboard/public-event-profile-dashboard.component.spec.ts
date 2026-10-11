import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventProfileDashboardComponent } from './public-event-profile-dashboard.component';

describe('PublicEventProfileDashboardComponent', () => {
  let component: PublicEventProfileDashboardComponent;
  let fixture: ComponentFixture<PublicEventProfileDashboardComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventProfileDashboardComponent],
    });

    fixture = TestBed.createComponent(PublicEventProfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
