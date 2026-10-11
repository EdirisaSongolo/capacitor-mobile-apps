import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserSocialsComponent } from './user-socials.component';

describe('UserSocialsComponent', () => {
  let component: UserSocialsComponent;
  let fixture: ComponentFixture<UserSocialsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [UserSocialsComponent] });

    fixture = TestBed.createComponent(UserSocialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
