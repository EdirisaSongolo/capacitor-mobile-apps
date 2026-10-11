import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CreateEventControlsComponent } from '@create-event/create-event-controls/create-event-controls.component';

describe('CreateEventControlsComponent', () => {
  let component: CreateEventControlsComponent;
  let fixture: ComponentFixture<CreateEventControlsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CreateEventControlsComponent] });
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(CreateEventControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
