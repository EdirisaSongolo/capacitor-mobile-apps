import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { NotificationsConfigService } from './notifications-config.service';

describe('NotificationsConfigService', () => {
  let service: NotificationsConfigService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(NotificationsConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
