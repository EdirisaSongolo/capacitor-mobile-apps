import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { GeoLocationService } from './geo-location.service';

describe('GeoLocationService', () => {
  let service: GeoLocationService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(GeoLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
