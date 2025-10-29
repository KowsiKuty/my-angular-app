import { TestBed } from '@angular/core/testing';

import { CbdatransactionserviceService } from './cbdatransactionservice.service';

describe('CbdatransactionserviceService', () => {
  let service: CbdatransactionserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CbdatransactionserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
