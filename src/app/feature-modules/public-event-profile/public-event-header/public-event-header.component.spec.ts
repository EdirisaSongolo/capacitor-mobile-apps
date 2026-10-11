import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventHeaderComponent } from './public-event-header.component';

describe('ProfileControlsComponent', () => {
  let component: PublicEventHeaderComponent;
  let fixture: ComponentFixture<PublicEventHeaderComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PublicEventHeaderComponent] });

    fixture = TestBed.createComponent(PublicEventHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
