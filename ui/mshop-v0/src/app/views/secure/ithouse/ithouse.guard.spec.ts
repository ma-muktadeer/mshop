import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ithouseGuard } from './ithouse.guard';

describe('ithouseGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ithouseGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
