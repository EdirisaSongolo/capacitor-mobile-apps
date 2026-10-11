import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CancelPublicEventComponent } from './cancel-public-event.component';

describe('CancelPublicEventComponent', () => {
  let component: CancelPublicEventComponent;
  let fixture: ComponentFixture<CancelPublicEventComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CancelPublicEventComponent] });

    fixture = TestBed.createComponent(CancelPublicEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
