import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ApiRequestsInterceptor } from './api-requests.interceptor';

describe('ApiRequestsInterceptor', () => {
  beforeEach(async () => {
    await configureTuuskaTest({ providers: [ApiRequestsInterceptor] });
  });

  it('should be created', () => {
    const interceptor: ApiRequestsInterceptor = TestBed.inject(
      ApiRequestsInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});
