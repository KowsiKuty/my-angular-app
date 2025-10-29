import { TestBed } from '@angular/core/testing';

import { DtpcShareService } from './dtpc-share.service';

describe('DtpcShareService', () => {
  let service: DtpcShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtpcShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
