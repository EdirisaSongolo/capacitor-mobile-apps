import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { RevenueAccountService } from './revenue-account.service';

describe('RevenueAccountService', () => {
  let service: RevenueAccountService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(RevenueAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
