import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileImageService } from './profile-image.service';

describe('ProfileImageService', () => {
  let service: ProfileImageService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(ProfileImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
