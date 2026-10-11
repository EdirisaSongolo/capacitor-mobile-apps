import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventAccountComponent } from './private-event-account.component';

describe('PrivateEventAccountComponent', () => {
  let component: PrivateEventAccountComponent;
  let fixture: ComponentFixture<PrivateEventAccountComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PrivateEventAccountComponent] });

    fixture = TestBed.createComponent(PrivateEventAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
