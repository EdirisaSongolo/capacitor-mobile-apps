import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventProfileDateDetailsComponent } from './public-event-profile-date-details.component';

describe('PublicEventProfileDateDetailsComponent', () => {
  let component: PublicEventProfileDateDetailsComponent;
  let fixture: ComponentFixture<PublicEventProfileDateDetailsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventProfileDateDetailsComponent],
    });

    fixture = TestBed.createComponent(PublicEventProfileDateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
