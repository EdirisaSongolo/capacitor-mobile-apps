import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventProfileMerchComponent } from './public-event-profile-merch.component';

describe('PublicEventProfileMerchComponent', () => {
  let component: PublicEventProfileMerchComponent;
  let fixture: ComponentFixture<PublicEventProfileMerchComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventProfileMerchComponent],
    });

    fixture = TestBed.createComponent(PublicEventProfileMerchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
