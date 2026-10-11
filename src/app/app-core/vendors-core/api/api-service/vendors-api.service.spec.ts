import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VendorsApiService } from './vendors-api.service';

describe('VendorsApiService', () => {
  let service: VendorsApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(VendorsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
