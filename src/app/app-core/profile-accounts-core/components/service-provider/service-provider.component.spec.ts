import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ServiceProviderComponent } from './service-provider.component';

describe('CreateUpdateBookingComponent', () => {
  let component: ServiceProviderComponent;
  let fixture: ComponentFixture<ServiceProviderComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [ServiceProviderComponent] });

    fixture = TestBed.createComponent(ServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
