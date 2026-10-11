import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VenuesDashboardMainComponent } from './venues-dashboard-main.component';

describe('VenuesDashboardMainComponent', () => {
  let component: VenuesDashboardMainComponent;
  let fixture: ComponentFixture<VenuesDashboardMainComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [VenuesDashboardMainComponent] });

    fixture = TestBed.createComponent(VenuesDashboardMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
