import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { DashBoardControlsComponent } from './dash-board-controls.component';

describe('DashBoardControlsComponent', () => {
  let component: DashBoardControlsComponent;
  let fixture: ComponentFixture<DashBoardControlsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [DashBoardControlsComponent] });

    fixture = TestBed.createComponent(DashBoardControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
