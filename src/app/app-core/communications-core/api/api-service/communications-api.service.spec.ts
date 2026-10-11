import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { CommunicationsApiService } from '@communications-core/api/api-service/communications-api.service';

describe('CommunicationsApiService', () => {
  let service: CommunicationsApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(CommunicationsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
