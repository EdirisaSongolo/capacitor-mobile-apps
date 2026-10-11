import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileServicesComponent } from './profile-services.component';

describe('ProfileServicesComponent', () => {
  let component: ProfileServicesComponent;
  let fixture: ComponentFixture<ProfileServicesComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [ProfileServicesComponent] });

    fixture = TestBed.createComponent(ProfileServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
