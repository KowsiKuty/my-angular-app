import { TestBed } from '@angular/core/testing';

import { FrsServiceService } from './frs-service.service';

describe('FrsServiceService', () => {
  let service: FrsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
