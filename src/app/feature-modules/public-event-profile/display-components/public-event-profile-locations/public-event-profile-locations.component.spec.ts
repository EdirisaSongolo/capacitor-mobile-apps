import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventProfileLocationsComponent } from './public-event-profile-locations.component';

describe('PublicEventProfileLocationsComponent', () => {
  let component: PublicEventProfileLocationsComponent;
  let fixture: ComponentFixture<PublicEventProfileLocationsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventProfileLocationsComponent],
    });

    fixture = TestBed.createComponent(PublicEventProfileLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
