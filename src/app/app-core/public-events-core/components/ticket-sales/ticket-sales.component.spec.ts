import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { TicketSalesComponent } from './ticket-sales.component';

describe('TicketSalesComponentComponent', () => {
  let component: TicketSalesComponent;
  let fixture: ComponentFixture<TicketSalesComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [TicketSalesComponent] });

    fixture = TestBed.createComponent(TicketSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
