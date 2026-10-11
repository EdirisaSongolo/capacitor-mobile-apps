import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { NamePreviewComponent } from './name-preview.component';

describe('NamePreviewComponent', () => {
  let component: NamePreviewComponent;
  let fixture: ComponentFixture<NamePreviewComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [NamePreviewComponent] });

    fixture = TestBed.createComponent(NamePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
