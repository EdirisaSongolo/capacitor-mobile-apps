import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VendorsDashboardMainComponent } from '@dash-board/feature-dashboards/vendors-dashboard';

describe('VendorsDashboardMainComponent', () => {
  let component: VendorsDashboardMainComponent;
  let fixture: ComponentFixture<VendorsDashboardMainComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [VendorsDashboardMainComponent],
    });

    fixture = TestBed.createComponent(VendorsDashboardMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
