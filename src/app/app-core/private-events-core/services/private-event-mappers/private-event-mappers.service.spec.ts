import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PrivateEventMappersService } from './private-event-mappers.service';

describe('PrivateEventMappersService', () => {
  let service: PrivateEventMappersService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(PrivateEventMappersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
