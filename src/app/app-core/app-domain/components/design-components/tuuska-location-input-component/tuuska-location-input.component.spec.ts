import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { TuuskaLocationInputComponent } from './tuuska-location-input.component';

describe('TuuskaLocationInputComponent', () => {
  let component: TuuskaLocationInputComponent;
  let fixture: ComponentFixture<TuuskaLocationInputComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [TuuskaLocationInputComponent],
    });

    fixture = TestBed.createComponent(TuuskaLocationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
