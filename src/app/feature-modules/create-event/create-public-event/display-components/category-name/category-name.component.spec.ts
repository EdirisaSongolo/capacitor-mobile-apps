import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CategoryNameComponent } from './category-name.component';

describe('CategoryNameComponent', () => {
  let component: CategoryNameComponent;
  let fixture: ComponentFixture<CategoryNameComponent>;

  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [CategoryNameComponent] });
    fixture = TestBed.createComponent(CategoryNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
