import { TestBed } from '@angular/core/testing';

import { FrsshareService } from './frsshare.service';

describe('FrsshareService', () => {
  let service: FrsshareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrsshareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
