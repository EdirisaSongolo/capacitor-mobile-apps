import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ApiResponseService } from '@app-core/app-api/api-response-handler/api-response.service';

describe('ApiResponseService', () => {
  let service: ApiResponseService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(ApiResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
