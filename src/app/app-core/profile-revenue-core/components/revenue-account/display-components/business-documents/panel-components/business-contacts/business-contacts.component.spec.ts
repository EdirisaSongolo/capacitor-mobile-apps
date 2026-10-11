import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { BusinessContactsComponent } from './business-contacts.component';

describe('BusinessContactsComponent', () => {
  let component: BusinessContactsComponent;
  let fixture: ComponentFixture<BusinessContactsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [BusinessContactsComponent] });

    fixture = TestBed.createComponent(BusinessContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
