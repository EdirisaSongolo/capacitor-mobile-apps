import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventsApiService } from './private-events-api.service';

describe('PrivateEventsApiService', () => {
  let service: PrivateEventsApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(PrivateEventsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
