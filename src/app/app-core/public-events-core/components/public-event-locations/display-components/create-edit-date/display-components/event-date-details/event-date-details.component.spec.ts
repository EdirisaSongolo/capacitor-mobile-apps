import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { EventDateDetailsComponent } from './event-date-details.component';

describe('EventDateDetailsComponent', () => {
  let component: EventDateDetailsComponent;
  let fixture: ComponentFixture<EventDateDetailsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [EventDateDetailsComponent] });

    fixture = TestBed.createComponent(EventDateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
