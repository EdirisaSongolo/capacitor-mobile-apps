import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VendorProfileManagementComponent } from './vendor-profile-manager.component';

describe('VendorProfileManagementComponent', () => {
  let component: VendorProfileManagementComponent;
  let fixture: ComponentFixture<VendorProfileManagementComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [VendorProfileManagementComponent],
    });

    fixture = TestBed.createComponent(VendorProfileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
