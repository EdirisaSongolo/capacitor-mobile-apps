import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserProfileInterestsComponent } from './user-profile-interests.component';

describe('UserProfileInterestsComponent', () => {
  let component: UserProfileInterestsComponent;
  let fixture: ComponentFixture<UserProfileInterestsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [UserProfileInterestsComponent],
    });

    fixture = TestBed.createComponent(UserProfileInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
