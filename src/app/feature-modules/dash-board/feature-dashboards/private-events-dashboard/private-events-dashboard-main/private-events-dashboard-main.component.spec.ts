import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventsDashboardMainComponent } from '@private-events-dashboard/private-events-dashboard-main/private-events-dashboard-main.component';

describe('PrivateEventsDashboardMainComponent', () => {
  let component: PrivateEventsDashboardMainComponent;
  let fixture: ComponentFixture<PrivateEventsDashboardMainComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PrivateEventsDashboardMainComponent],
    });

    fixture = TestBed.createComponent(PrivateEventsDashboardMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
