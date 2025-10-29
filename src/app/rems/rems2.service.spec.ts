import { TestBed } from '@angular/core/testing';

import { Rems2Service } from './rems2.service';

describe('Rems2Service', () => {
  let service: Rems2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rems2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
