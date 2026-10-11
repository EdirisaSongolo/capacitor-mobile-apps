import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserAccountHeaderComponent } from './user-account-header.component';

describe('ProfileHeaderComponent', () => {
  let component: UserAccountHeaderComponent;
  let fixture: ComponentFixture<UserAccountHeaderComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [UserAccountHeaderComponent] });

    fixture = TestBed.createComponent(UserAccountHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
