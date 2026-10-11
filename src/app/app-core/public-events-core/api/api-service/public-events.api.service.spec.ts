import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventsApiService } from './public-events.api.service';

describe('PublicEventsApiService', () => {
  let service: PublicEventsApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(PublicEventsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
