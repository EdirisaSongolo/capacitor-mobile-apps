import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { VenuesApiService } from './venues.api.service';

describe('VenuesApiServiceService', () => {
  let service: VenuesApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(VenuesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
