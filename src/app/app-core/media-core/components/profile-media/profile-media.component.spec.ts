import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileMediaComponent } from './profile-media.component';

describe('ProfileMediaComponent', () => {
  let component: ProfileMediaComponent;
  let fixture: ComponentFixture<ProfileMediaComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [ProfileMediaComponent] });

    fixture = TestBed.createComponent(ProfileMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
