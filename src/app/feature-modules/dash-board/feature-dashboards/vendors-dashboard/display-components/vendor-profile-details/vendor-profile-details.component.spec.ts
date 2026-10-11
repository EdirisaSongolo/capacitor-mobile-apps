import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VendorProfileDetailsComponent } from './vendor-profile-details.component';

describe('VendorProfileDetailsComponent', () => {
  let component: VendorProfileDetailsComponent;
  let fixture: ComponentFixture<VendorProfileDetailsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [VendorProfileDetailsComponent],
    });

    fixture = TestBed.createComponent(VendorProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
