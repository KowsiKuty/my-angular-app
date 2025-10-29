import { TestBed } from '@angular/core/testing';

import { LcaService } from './lca.service';

describe('LcaService', () => {
  let service: LcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
