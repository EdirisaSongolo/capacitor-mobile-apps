import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { PostAccessService } from '@communications-core/services/post-access/post-access.service';

describe('PostAccessService', () => {
  let service: PostAccessService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(PostAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
