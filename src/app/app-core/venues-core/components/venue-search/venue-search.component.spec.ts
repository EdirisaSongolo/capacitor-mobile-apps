import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VenueSearchComponent } from './venue-search.component';

describe('VenuesComponent', () => {
  let component: VenueSearchComponent;
  let fixture: ComponentFixture<VenueSearchComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [VenueSearchComponent] });

    fixture = TestBed.createComponent(VenueSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
