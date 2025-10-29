import { TestBed } from '@angular/core/testing';

import { ReportserviceService } from './reportservice.service';

describe('ReportserviceService', () => {
  let service: ReportserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
