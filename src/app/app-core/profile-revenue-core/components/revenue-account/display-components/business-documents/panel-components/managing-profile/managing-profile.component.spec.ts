import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ManagingProfileComponent } from './managing-profile.component';

describe('ManagingProfileComponent', () => {
  let component: ManagingProfileComponent;
  let fixture: ComponentFixture<ManagingProfileComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [ManagingProfileComponent] });

    fixture = TestBed.createComponent(ManagingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
