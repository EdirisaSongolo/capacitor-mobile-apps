import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { AccountSocialsComponent } from './account-socials.component';

describe('AccountSocialsComponent', () => {
  let component: AccountSocialsComponent;
  let fixture: ComponentFixture<AccountSocialsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [AccountSocialsComponent] });

    fixture = TestBed.createComponent(AccountSocialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
