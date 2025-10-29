import { TestBed } from '@angular/core/testing';

import { LeadsmainService } from './leadsmain.service';

describe('LeadsmainService', () => {
  let service: LeadsmainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadsmainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
