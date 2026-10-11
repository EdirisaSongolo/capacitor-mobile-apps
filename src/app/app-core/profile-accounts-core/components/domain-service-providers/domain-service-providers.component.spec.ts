import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { DomainServiceProvidersComponent } from './domain-service-providers.component';

describe('DomainServiceProvidersComponent', () => {
  let component: DomainServiceProvidersComponent;
  let fixture: ComponentFixture<DomainServiceProvidersComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [DomainServiceProvidersComponent],
    });

    fixture = TestBed.createComponent(DomainServiceProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
