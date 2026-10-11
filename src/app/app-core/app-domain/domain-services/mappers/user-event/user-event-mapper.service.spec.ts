import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { UserEventMapperService } from './user-event-mapper.service';

describe('UserEventMapperService', () => {
  let service: UserEventMapperService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(UserEventMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
