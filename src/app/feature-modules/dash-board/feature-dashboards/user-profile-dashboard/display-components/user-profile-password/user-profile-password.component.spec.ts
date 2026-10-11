import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserProfilePasswordComponent } from './user-profile-password.component';

describe('UserProfilePasswordComponent', () => {
  let component: UserProfilePasswordComponent;
  let fixture: ComponentFixture<UserProfilePasswordComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [UserProfilePasswordComponent] });

    fixture = TestBed.createComponent(UserProfilePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
