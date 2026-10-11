import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CreateEditStaffComponent } from './create-edit-staff.component';

describe('CreateEditStaffComponent', () => {
  let component: CreateEditStaffComponent;
  let fixture: ComponentFixture<CreateEditStaffComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CreateEditStaffComponent] });

    fixture = TestBed.createComponent(CreateEditStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
