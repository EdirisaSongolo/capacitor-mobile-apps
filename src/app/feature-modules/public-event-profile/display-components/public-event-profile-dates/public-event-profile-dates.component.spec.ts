import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventProfileDatesComponent } from './public-event-profile-dates.component';

describe('PublicEventProfileDatesComponent', () => {
  let component: PublicEventProfileDatesComponent;
  let fixture: ComponentFixture<PublicEventProfileDatesComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventProfileDatesComponent],
    });

    fixture = TestBed.createComponent(PublicEventProfileDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
