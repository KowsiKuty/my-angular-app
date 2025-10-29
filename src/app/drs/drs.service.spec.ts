import { TestBed } from '@angular/core/testing';

import { DrsService } from './drs.service';

describe('DrsService', () => {
  let service: DrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
