import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VenueProfileDetailsComponent } from './venue-profile-details.component';

describe('VenueProfileDetailsComponent', () => {
  let component: VenueProfileDetailsComponent;
  let fixture: ComponentFixture<VenueProfileDetailsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [VenueProfileDetailsComponent] });

    fixture = TestBed.createComponent(VenueProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
