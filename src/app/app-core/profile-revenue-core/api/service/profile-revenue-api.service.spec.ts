import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileRevenueApiService } from './profile-revenue-api.service';

describe('ProfileRevenueApiService', () => {
  let service: ProfileRevenueApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(ProfileRevenueApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
