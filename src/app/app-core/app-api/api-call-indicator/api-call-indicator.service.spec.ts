import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ApiCallIndicatorService } from './api-call-indicator.service';

describe('ApiCallIndicatorService', () => {
  let service: ApiCallIndicatorService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(ApiCallIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
