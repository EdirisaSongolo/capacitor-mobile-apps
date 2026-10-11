import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventsDashboardMainComponent } from '@dash-board/feature-dashboards/public-events-dashboard';

describe('PublicEventsDashboardMainComponent', () => {
  let component: PublicEventsDashboardMainComponent;
  let fixture: ComponentFixture<PublicEventsDashboardMainComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventsDashboardMainComponent],
    });

    fixture = TestBed.createComponent(PublicEventsDashboardMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
