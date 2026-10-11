import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { EventDateVenueComponent } from './event-date-venue.component';

describe('EventDateVenueComponent', () => {
  let component: EventDateVenueComponent;
  let fixture: ComponentFixture<EventDateVenueComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [EventDateVenueComponent] });

    fixture = TestBed.createComponent(EventDateVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
