import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CancelPrivateEventComponent } from './cancel-private-event.component';

describe('CancelPrivateEventComponent', () => {
  let component: CancelPrivateEventComponent;
  let fixture: ComponentFixture<CancelPrivateEventComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CancelPrivateEventComponent] });

    fixture = TestBed.createComponent(CancelPrivateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
