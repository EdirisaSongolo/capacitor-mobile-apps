import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventLocationComponent } from './private-event-location.component';

describe('PrivateEventLocationComponent', () => {
  let component: PrivateEventLocationComponent;
  let fixture: ComponentFixture<PrivateEventLocationComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PrivateEventLocationComponent],
    });

    fixture = TestBed.createComponent(PrivateEventLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
