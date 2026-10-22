import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { TicketScanComponent } from './ticket-scan.component';

describe('TicketScanComponent', () => {
  let component: TicketScanComponent;
  let fixture: ComponentFixture<TicketScanComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [TicketScanComponent] });

    fixture = TestBed.createComponent(TicketScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
