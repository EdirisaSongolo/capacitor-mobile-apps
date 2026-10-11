import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventDetailsComponent } from './public-event-details.component';

describe('PublicEventDetailsComponent', () => {
  let component: PublicEventDetailsComponent;
  let fixture: ComponentFixture<PublicEventDetailsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PublicEventDetailsComponent] });

    fixture = TestBed.createComponent(PublicEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
