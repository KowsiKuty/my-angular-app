import { TestBed } from '@angular/core/testing';

import { LeadserviceService } from './leadservice.service';

describe('LeadserviceService', () => {
  let service: LeadserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
