import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CompositeApiService } from './composite-api.service';

describe('CompositeApiService', () => {
  let service: CompositeApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(CompositeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
