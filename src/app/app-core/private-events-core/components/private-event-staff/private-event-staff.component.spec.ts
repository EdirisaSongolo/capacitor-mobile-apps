import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventStaffComponent } from './private-event-staff.component';

describe('PrivateEventStaffComponent', () => {
  let component: PrivateEventStaffComponent;
  let fixture: ComponentFixture<PrivateEventStaffComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PrivateEventStaffComponent] });

    fixture = TestBed.createComponent(PrivateEventStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
