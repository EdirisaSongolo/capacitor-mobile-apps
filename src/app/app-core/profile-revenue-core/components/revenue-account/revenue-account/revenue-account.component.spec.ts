import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { RevenueAccountComponent } from './revenue-account.component';

describe('BusinessProfileComponent', () => {
  let component: RevenueAccountComponent;
  let fixture: ComponentFixture<RevenueAccountComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [RevenueAccountComponent] });

    fixture = TestBed.createComponent(RevenueAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
