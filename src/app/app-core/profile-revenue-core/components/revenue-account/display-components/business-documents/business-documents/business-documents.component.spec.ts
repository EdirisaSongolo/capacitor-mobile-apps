import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { BusinessDocumentsComponent } from './business-documents.component';

describe('BusinessDocumentsComponent', () => {
  let component: BusinessDocumentsComponent;
  let fixture: ComponentFixture<BusinessDocumentsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [BusinessDocumentsComponent] });

    fixture = TestBed.createComponent(BusinessDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
