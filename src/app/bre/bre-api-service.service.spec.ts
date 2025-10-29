import { TestBed } from '@angular/core/testing';

import { BreApiServiceService } from './bre-api-service.service';

describe('BreApiServiceService', () => {
  let service: BreApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
