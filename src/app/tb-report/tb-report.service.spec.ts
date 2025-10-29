import { TestBed } from '@angular/core/testing';

import { TbReportService } from './tb-report.service';

describe('TbReportService', () => {
  let service: TbReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TbReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
