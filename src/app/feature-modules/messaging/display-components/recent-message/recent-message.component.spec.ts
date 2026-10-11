import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { RecentMessageComponent } from './recent-message.component';

describe('RecentMessageComponent', () => {
  let component: RecentMessageComponent;
  let fixture: ComponentFixture<RecentMessageComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [RecentMessageComponent] });

    fixture = TestBed.createComponent(RecentMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
