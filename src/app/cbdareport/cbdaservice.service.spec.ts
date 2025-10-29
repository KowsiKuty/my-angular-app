import { TestBed } from '@angular/core/testing';

import { CbdaserviceService } from './cbdaservice.service';

describe('CbdaserviceService', () => {
  let service: CbdaserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CbdaserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
