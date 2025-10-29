import { TestBed } from '@angular/core/testing';

import { TnebShareService } from './tneb-share.service';

describe('TnebShareService', () => {
  let service: TnebShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TnebShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
