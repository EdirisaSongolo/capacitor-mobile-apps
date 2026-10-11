import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { MediaFilePlacComponent } from './media-file-plac.component';

describe('MediaFilePlacComponent', () => {
  let component: MediaFilePlacComponent;
  let fixture: ComponentFixture<MediaFilePlacComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [MediaFilePlacComponent] });

    fixture = TestBed.createComponent(MediaFilePlacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
