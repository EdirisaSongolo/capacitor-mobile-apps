import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CreatePublicEventComponent } from './create-public-event.component';

describe('CreatePublicEventComponent', () => {
  let component: CreatePublicEventComponent;
  let fixture: ComponentFixture<CreatePublicEventComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CreatePublicEventComponent] });
    fixture = TestBed.createComponent(CreatePublicEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
