import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PaymentAuthorisationComponent } from './payment-authorisation.component';

describe('PaymentAuthorisationComponent', () => {
  let component: PaymentAuthorisationComponent;
  let fixture: ComponentFixture<PaymentAuthorisationComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PaymentAuthorisationComponent],
    });

    fixture = TestBed.createComponent(PaymentAuthorisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
