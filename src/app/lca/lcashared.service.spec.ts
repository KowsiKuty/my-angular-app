import { TestBed } from '@angular/core/testing';

import { LcasharedService } from './lcashared.service';

describe('LcasharedService', () => {
  let service: LcasharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LcasharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
