import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { TuuskaInputComponent } from './tuuska-input.component';

describe('TuuskaInputComponent', () => {
  let component: TuuskaInputComponent;
  let fixture: ComponentFixture<TuuskaInputComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [TuuskaInputComponent] });

    fixture = TestBed.createComponent(TuuskaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
