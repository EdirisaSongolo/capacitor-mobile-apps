import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileMapperService } from './profile-mapper.service';

describe('ProfileMapperService', () => {
  let service: ProfileMapperService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(ProfileMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
