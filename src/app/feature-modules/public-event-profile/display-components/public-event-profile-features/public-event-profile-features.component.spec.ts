import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventProfileFeaturesComponent } from './public-event-profile-features.component';

describe('PublicEventProfileFeaturesComponent', () => {
  let component: PublicEventProfileFeaturesComponent;
  let fixture: ComponentFixture<PublicEventProfileFeaturesComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventProfileFeaturesComponent],
    });

    fixture = TestBed.createComponent(PublicEventProfileFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
