import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VenueProfileComponent } from './venue-profile.component';

describe('VenueProfileComponent', () => {
  let component: VenueProfileComponent;
  let fixture: ComponentFixture<VenueProfileComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [VenueProfileComponent] });

    fixture = TestBed.createComponent(VenueProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
