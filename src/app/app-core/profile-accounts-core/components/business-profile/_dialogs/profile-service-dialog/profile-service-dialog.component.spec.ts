import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileServiceDialogComponent } from './profile-service-dialog.component';

describe('ProfileServiceDialogComponent', () => {
  let component: ProfileServiceDialogComponent;
  let fixture: ComponentFixture<ProfileServiceDialogComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [ProfileServiceDialogComponent],
    });

    fixture = TestBed.createComponent(ProfileServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
