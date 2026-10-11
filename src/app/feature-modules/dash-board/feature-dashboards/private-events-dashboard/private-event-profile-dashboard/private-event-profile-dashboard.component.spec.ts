import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventProfileDashboardComponent } from './private-event-profile-dashboard.component';

describe('PrivateEventProfileDashboardComponent', () => {
  let component: PrivateEventProfileDashboardComponent;
  let fixture: ComponentFixture<PrivateEventProfileDashboardComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PrivateEventProfileDashboardComponent],
    });

    fixture = TestBed.createComponent(PrivateEventProfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
