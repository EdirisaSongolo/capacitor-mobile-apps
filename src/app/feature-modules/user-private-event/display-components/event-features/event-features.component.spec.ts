import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { EventFeaturesComponent } from './event-features.component';

describe('EventFeaturesComponent', () => {
  let component: EventFeaturesComponent;
  let fixture: ComponentFixture<EventFeaturesComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [EventFeaturesComponent] });

    fixture = TestBed.createComponent(EventFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
