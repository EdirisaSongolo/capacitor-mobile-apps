import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { DashBoardAppsComponent } from './dash-board-apps.component';

describe('DashBoardAppsComponent', () => {
  let component: DashBoardAppsComponent;
  let fixture: ComponentFixture<DashBoardAppsComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [DashBoardAppsComponent] });

    fixture = TestBed.createComponent(DashBoardAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
