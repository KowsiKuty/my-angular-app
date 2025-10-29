import { TestBed } from '@angular/core/testing';

import { DatamigrationserviceService } from './datamigrationservice.service';

describe('DatamigrationserviceService', () => {
  let service: DatamigrationserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatamigrationserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
