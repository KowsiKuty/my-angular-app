import { TestBed } from '@angular/core/testing';

import { EcfapService } from './ecfap.service';

describe('EcfapService', () => {
  let service: EcfapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcfapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
