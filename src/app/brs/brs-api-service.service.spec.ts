import { TestBed } from '@angular/core/testing';

import { BrsApiServiceService } from './brs-api-service.service';

describe('BrsApiServiceService', () => {
  let service: BrsApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrsApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
