import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VendorPlacComponent } from './vendor-plac.component';

describe('VendorPlacComponent', () => {
  let component: VendorPlacComponent;
  let fixture: ComponentFixture<VendorPlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [VendorPlacComponent] });

    fixture = TestBed.createComponent(VendorPlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
