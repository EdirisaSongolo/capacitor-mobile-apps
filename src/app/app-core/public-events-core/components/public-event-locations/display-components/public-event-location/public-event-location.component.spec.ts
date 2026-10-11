import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventLocationComponent } from './public-event-location.component';

describe('PublicEventDatesComponent', () => {
  let component: PublicEventLocationComponent;
  let fixture: ComponentFixture<PublicEventLocationComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PublicEventLocationComponent] });

    fixture = TestBed.createComponent(PublicEventLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
