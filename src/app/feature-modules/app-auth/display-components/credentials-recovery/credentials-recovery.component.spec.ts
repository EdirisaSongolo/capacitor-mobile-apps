import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CredentialsRecoveryComponent } from './credentials-recovery.component';

describe('CredentialsRecoveryComponent', () => {
  let component: CredentialsRecoveryComponent;
  let fixture: ComponentFixture<CredentialsRecoveryComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CredentialsRecoveryComponent] });
    fixture = TestBed.createComponent(CredentialsRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
