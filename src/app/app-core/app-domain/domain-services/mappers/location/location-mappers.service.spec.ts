import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { LocationMappersService } from './location-mappers.service';

describe('LocationMappersService', () => {
  let service: LocationMappersService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(LocationMappersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
