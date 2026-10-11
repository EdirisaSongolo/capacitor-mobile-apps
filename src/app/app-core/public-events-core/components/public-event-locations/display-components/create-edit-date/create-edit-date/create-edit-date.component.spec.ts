import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CreateEditDateComponent } from './create-edit-date.component';

describe('CreateEditDateComponent', () => {
  let component: CreateEditDateComponent;
  let fixture: ComponentFixture<CreateEditDateComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CreateEditDateComponent] });

    fixture = TestBed.createComponent(CreateEditDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
