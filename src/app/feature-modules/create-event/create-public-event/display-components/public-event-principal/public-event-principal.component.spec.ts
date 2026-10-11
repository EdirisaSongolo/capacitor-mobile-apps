import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventPrincipalComponent } from './public-event-principal.component';

describe('PublicEventPrincipalComponent', () => {
  let component: PublicEventPrincipalComponent;
  let fixture: ComponentFixture<PublicEventPrincipalComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({
      declarations: [PublicEventPrincipalComponent],
    });

    fixture = TestBed.createComponent(PublicEventPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
