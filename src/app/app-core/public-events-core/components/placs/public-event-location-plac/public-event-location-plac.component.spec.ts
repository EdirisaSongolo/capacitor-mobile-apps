import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventLocationPlacComponent } from './public-event-location-plac.component';

describe('PublicEventLocationPlacComponent', () => {
  let component: PublicEventLocationPlacComponent;
  let fixture: ComponentFixture<PublicEventLocationPlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventLocationPlacComponent],
    });

    fixture = TestBed.createComponent(PublicEventLocationPlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
