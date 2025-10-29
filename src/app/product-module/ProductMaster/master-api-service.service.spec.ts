import { TestBed } from '@angular/core/testing';

import { MasterApiServiceService } from './master-api-service.service';

describe('MasterApiServiceService', () => {
  let service: MasterApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
