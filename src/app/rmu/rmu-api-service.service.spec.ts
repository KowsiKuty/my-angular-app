import { TestBed } from '@angular/core/testing';

import { RmuApiServiceService } from './rmu-api-service.service';

describe('RmuApiServiceService', () => {
  let service: RmuApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RmuApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
