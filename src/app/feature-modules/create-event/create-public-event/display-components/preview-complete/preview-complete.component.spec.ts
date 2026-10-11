import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PreviewCompleteComponent } from './preview-complete.component';

describe('PreviewCompleteComponent', () => {
  let component: PreviewCompleteComponent;
  let fixture: ComponentFixture<PreviewCompleteComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PreviewCompleteComponent] });
    fixture = TestBed.createComponent(PreviewCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
