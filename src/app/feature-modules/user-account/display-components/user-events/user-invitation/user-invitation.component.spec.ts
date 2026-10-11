import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserInvitationComponent } from './user-invitation.component';

describe('UserInvitationComponent', () => {
  let component: UserInvitationComponent;
  let fixture: ComponentFixture<UserInvitationComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [UserInvitationComponent] });

    fixture = TestBed.createComponent(UserInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
