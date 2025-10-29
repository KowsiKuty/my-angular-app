import { TestBed } from '@angular/core/testing';

import { SGShareService } from './share.service';

describe('RemsShareService', () => {
  let service: SGShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SGShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});