import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { IdentityVerificationComponent } from './identity-verification.component';

describe('IdentityVerificationComponent', () => {
  let component: IdentityVerificationComponent;
  let fixture: ComponentFixture<IdentityVerificationComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [IdentityVerificationComponent],
    });

    fixture = TestBed.createComponent(IdentityVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
