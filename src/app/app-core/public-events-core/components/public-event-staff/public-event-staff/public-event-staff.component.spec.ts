import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventStaffComponent } from './public-event-staff.component';

describe('PublicEventStaffComponent', () => {
  let component: PublicEventStaffComponent;
  let fixture: ComponentFixture<PublicEventStaffComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PublicEventStaffComponent] });

    fixture = TestBed.createComponent(PublicEventStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
