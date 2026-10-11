import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserProfileApiService } from './user-profile-api.service';

describe('UserProfileApiService', () => {
  let service: UserProfileApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(UserProfileApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
