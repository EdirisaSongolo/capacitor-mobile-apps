import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { BreakPointService } from './break-point.service';

describe('BreakPointService', () => {
  let service: BreakPointService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(BreakPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
