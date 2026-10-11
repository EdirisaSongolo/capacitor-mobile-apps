import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProviderServicePlacComponent } from './provider-service-plac.component';

describe('ProviderServicePlacComponent', () => {
  let component: ProviderServicePlacComponent;
  let fixture: ComponentFixture<ProviderServicePlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [ProviderServicePlacComponent] });

    fixture = TestBed.createComponent(ProviderServicePlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
