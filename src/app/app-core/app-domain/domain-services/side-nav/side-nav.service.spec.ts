import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { SideNavService } from '@domain-services/side-nav/side-nav.service';

describe('SideNavService', () => {
  let service: SideNavService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(SideNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
