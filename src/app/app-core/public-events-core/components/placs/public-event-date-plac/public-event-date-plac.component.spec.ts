import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventDatePlacComponent } from './public-event-date-plac.component';

describe('PublicEventDatePlacComponent', () => {
  let component: PublicEventDatePlacComponent;
  let fixture: ComponentFixture<PublicEventDatePlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PublicEventDatePlacComponent] });

    fixture = TestBed.createComponent(PublicEventDatePlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
