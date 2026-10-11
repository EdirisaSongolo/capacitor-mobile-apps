import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { EventDateFeaturesComponent } from './event-date-features.component';

describe('EventDateFeaturesComponent', () => {
  let component: EventDateFeaturesComponent;
  let fixture: ComponentFixture<EventDateFeaturesComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [EventDateFeaturesComponent] });

    fixture = TestBed.createComponent(EventDateFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
