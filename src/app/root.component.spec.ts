import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { RootComponent } from '@root-component';

describe('RootComponent', () => {
  beforeEach(async () => {
    await configureTuuskaTest({ declarations: [RootComponent] });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
