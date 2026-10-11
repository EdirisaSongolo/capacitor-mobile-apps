import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileProcessorService } from './profile-processor.service';

describe('ProfileProcessorService', () => {
  let service: ProfileProcessorService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(ProfileProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
