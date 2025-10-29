import { TestBed } from '@angular/core/testing';

import { RcsaServiceService } from './rcsa-service.service';

describe('RcsaServiceService', () => {
  let service: RcsaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RcsaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
