import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventPlacComponent } from './private-event-plac.component';

describe('PrivateEventPlacComponent', () => {
  let component: PrivateEventPlacComponent;
  let fixture: ComponentFixture<PrivateEventPlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PrivateEventPlacComponent] });

    fixture = TestBed.createComponent(PrivateEventPlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
