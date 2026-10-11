import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PublicEventMappersService } from './public-event-mappers.service';

describe('PublicEventMappersService', () => {
  let service: PublicEventMappersService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(PublicEventMappersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
