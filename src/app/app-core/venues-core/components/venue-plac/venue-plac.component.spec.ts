import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VenuePlacComponent } from './venue-plac.component';

describe('VenuePlacComponent', () => {
  let component: VenuePlacComponent;
  let fixture: ComponentFixture<VenuePlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [VenuePlacComponent] });

    fixture = TestBed.createComponent(VenuePlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
