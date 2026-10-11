import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventProfileComponent } from './public-event-profile.component';

describe('PublicEventProfileComponent', () => {
  let component: PublicEventProfileComponent;
  let fixture: ComponentFixture<PublicEventProfileComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PublicEventProfileComponent] });

    fixture = TestBed.createComponent(PublicEventProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
