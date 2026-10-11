import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventPlacComponent } from './public-event-plac.component';

describe('PublicEventPlacComponent', () => {
  let component: PublicEventPlacComponent;
  let fixture: ComponentFixture<PublicEventPlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PublicEventPlacComponent] });

    fixture = TestBed.createComponent(PublicEventPlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
