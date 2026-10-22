import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { DateFeaturesComponent } from './date-features.component';

describe('DateFeaturesComponent', () => {
  let component: DateFeaturesComponent;
  let fixture: ComponentFixture<DateFeaturesComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [DateFeaturesComponent] });

    fixture = TestBed.createComponent(DateFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
