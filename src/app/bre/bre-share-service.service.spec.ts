import { TestBed } from '@angular/core/testing';

import { BreShareServiceService } from './bre-share-service.service';

describe('BreShareServiceService', () => {
  let service: BreShareServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreShareServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
