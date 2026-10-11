import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserPublicEventComponent } from './user-public-event.component';

describe('UserPublicEventComponent', () => {
  let component: UserPublicEventComponent;
  let fixture: ComponentFixture<UserPublicEventComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [UserPublicEventComponent] });

    fixture = TestBed.createComponent(UserPublicEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
