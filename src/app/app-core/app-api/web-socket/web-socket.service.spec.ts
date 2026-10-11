import { TestBed } from '@angular/core/testing';

import { configureTuuskaTest } from '@testing/tuuska-testing';
import { WebSocketService } from './web-socket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(async () => {
    await configureTuuskaTest();
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
