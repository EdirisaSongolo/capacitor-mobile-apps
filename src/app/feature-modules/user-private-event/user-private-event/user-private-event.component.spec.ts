import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserPrivateEventComponent } from './user-private-event.component';

describe('UserPrivateEventComponent', () => {
  let component: UserPrivateEventComponent;
  let fixture: ComponentFixture<UserPrivateEventComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [UserPrivateEventComponent] });

    fixture = TestBed.createComponent(UserPrivateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
