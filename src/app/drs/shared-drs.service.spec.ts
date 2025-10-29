import { TestBed } from '@angular/core/testing';

import { SharedDrsService } from './shared-drs.service';

describe('SharedDrsService', () => {
  let service: SharedDrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
