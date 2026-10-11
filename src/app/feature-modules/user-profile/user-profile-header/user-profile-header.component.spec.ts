import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserProfileHeaderComponent } from './user-profile-header.component';

describe('UserProfileControlsComponent', () => {
  let component: UserProfileHeaderComponent;
  let fixture: ComponentFixture<UserProfileHeaderComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [UserProfileHeaderComponent] });

    fixture = TestBed.createComponent(UserProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
