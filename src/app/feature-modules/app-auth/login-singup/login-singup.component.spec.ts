import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { LoginSingupComponent } from './login-singup.component';

describe('LoginSingupComponent', () => {
  let component: LoginSingupComponent;
  let fixture: ComponentFixture<LoginSingupComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [LoginSingupComponent] });
    fixture = TestBed.createComponent(LoginSingupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
