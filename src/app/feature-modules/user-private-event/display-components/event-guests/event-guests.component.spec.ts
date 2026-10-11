import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { EventGuestsComponent } from './event-guests.component';

describe('EventGuestsComponent', () => {
  let component: EventGuestsComponent;
  let fixture: ComponentFixture<EventGuestsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [EventGuestsComponent] });

    fixture = TestBed.createComponent(EventGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
