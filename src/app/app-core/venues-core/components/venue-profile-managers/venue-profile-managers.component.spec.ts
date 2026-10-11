import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VenueProfileManagementComponent } from './venue-profile-managers.component';

describe('VenueProfileManagementComponent', () => {
  let component: VenueProfileManagementComponent;
  let fixture: ComponentFixture<VenueProfileManagementComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [VenueProfileManagementComponent],
    });

    fixture = TestBed.createComponent(VenueProfileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
