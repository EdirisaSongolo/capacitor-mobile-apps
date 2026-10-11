import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { AppResponseService } from './app-response.service';

describe('AppResponseService', () => {
  let service: AppResponseService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(AppResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
