import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserProfilePlacComponent } from './user-profile-plac.component';

describe('UserProfilePlacComponent', () => {
  let component: UserProfilePlacComponent;
  let fixture: ComponentFixture<UserProfilePlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [UserProfilePlacComponent] });

    fixture = TestBed.createComponent(UserProfilePlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
