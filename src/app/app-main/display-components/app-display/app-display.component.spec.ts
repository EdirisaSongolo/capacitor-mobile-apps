import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { AppDisplayComponent } from './app-display.component';

describe('AppDisplayComponent', () => {
  let component: AppDisplayComponent;
  let fixture: ComponentFixture<AppDisplayComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [AppDisplayComponent] });
    fixture = TestBed.createComponent(AppDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
