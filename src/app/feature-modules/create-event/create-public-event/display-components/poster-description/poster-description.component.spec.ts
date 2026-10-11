import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PosterDescriptionComponent } from './poster-description.component';

describe('PosterDescriptionComponent', () => {
  let component: PosterDescriptionComponent;
  let fixture: ComponentFixture<PosterDescriptionComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [PosterDescriptionComponent] });
    fixture = TestBed.createComponent(PosterDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
