import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VenueProfileHeaderComponent } from './venue-profile-header.component';

describe('VenueProfileHeaderComponent', () => {
  let component: VenueProfileHeaderComponent;
  let fixture: ComponentFixture<VenueProfileHeaderComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [VenueProfileHeaderComponent] });

    fixture = TestBed.createComponent(VenueProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
