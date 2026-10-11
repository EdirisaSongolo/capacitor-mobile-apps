import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventGuestsComponent } from './private-event-guests.component';

describe('PrivateEventProfileGuestsComponent', () => {
  let component: PrivateEventGuestsComponent;
  let fixture: ComponentFixture<PrivateEventGuestsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PrivateEventGuestsComponent] });

    fixture = TestBed.createComponent(PrivateEventGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
