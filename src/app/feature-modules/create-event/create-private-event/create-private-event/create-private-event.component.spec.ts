import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CreatePrivateEventComponent } from './create-private-event.component';

describe('CreatePrivateEventComponent', () => {
  let component: CreatePrivateEventComponent;
  let fixture: ComponentFixture<CreatePrivateEventComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CreatePrivateEventComponent] });

    fixture = TestBed.createComponent(CreatePrivateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
