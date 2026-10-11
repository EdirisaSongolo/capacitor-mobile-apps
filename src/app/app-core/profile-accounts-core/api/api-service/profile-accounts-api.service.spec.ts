import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { ProfileAccountsApiService } from './profile-accounts-api.service';

describe('ProfileAccountsApiService', () => {
  let service: ProfileAccountsApiService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(ProfileAccountsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
