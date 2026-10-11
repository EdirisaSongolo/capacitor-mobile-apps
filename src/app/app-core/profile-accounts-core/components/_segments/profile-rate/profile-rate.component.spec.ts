import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileRateComponent } from './profile-rate.component';

describe('ProfileRateComponent', () => {
  let component: ProfileRateComponent;
  let fixture: ComponentFixture<ProfileRateComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [ProfileRateComponent] });

    fixture = TestBed.createComponent(ProfileRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
