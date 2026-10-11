import { configureTuuskaTest } from '@testing/tuuska-testing';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  beforeEach(async () => {
    await configureTuuskaTest();
  });

  it('should be defined', () => {
    expect(authGuard).toBeTruthy();
  });
});
