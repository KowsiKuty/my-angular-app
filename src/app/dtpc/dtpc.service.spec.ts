import { TestBed } from '@angular/core/testing';

import { DtpcService } from './dtpc.service';

describe('DtpcService', () => {
  let service: DtpcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtpcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
