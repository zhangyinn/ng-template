import { TestBed } from '@angular/core/testing';

import { NetInterceptor } from './net.interceptor';

describe('NetInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [NetInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: NetInterceptor = TestBed.inject(NetInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
