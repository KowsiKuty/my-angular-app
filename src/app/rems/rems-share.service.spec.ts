import { TestBed } from '@angular/core/testing';

import { RemsShareService } from './rems-share.service';

describe('RemsShareService', () => {
  let service: RemsShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemsShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
