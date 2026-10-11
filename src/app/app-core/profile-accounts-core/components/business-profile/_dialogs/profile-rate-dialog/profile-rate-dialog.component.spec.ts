import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileRateDialogComponent } from './profile-rate-dialog.component';

describe('ProfileRateDialogComponent', () => {
  let component: ProfileRateDialogComponent;
  let fixture: ComponentFixture<ProfileRateDialogComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [ProfileRateDialogComponent] });

    fixture = TestBed.createComponent(ProfileRateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
