import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { MediaApiService } from './media-api.service';

describe('MediaApiService', () => {
  let service: MediaApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(MediaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
