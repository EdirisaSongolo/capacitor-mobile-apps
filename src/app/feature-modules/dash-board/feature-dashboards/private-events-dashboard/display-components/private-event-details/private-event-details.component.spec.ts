import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventDetailsComponent } from './private-event-details.component';

describe('PrivateEventDetailsComponent', () => {
  let component: PrivateEventDetailsComponent;
  let fixture: ComponentFixture<PrivateEventDetailsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PrivateEventDetailsComponent] });

    fixture = TestBed.createComponent(PrivateEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
