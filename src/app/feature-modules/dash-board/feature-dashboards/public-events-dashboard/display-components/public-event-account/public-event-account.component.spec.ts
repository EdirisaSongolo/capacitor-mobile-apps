import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventAccountComponent } from './public-event-account.component';

describe('PublicEventAccountComponent', () => {
  let component: PublicEventAccountComponent;
  let fixture: ComponentFixture<PublicEventAccountComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PublicEventAccountComponent] });

    fixture = TestBed.createComponent(PublicEventAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
