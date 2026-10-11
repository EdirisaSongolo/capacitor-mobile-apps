import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { TuuskaDateInputComponent } from './tuuska-date-input.component';

describe('DateInputComponent', () => {
  let component: TuuskaDateInputComponent;
  let fixture: ComponentFixture<TuuskaDateInputComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [TuuskaDateInputComponent] });

    fixture = TestBed.createComponent(TuuskaDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
