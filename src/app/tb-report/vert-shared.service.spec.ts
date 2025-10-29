import { TestBed } from '@angular/core/testing';

import { VertSharedService } from './vert-shared.service';

describe('VertSharedService', () => {
  let service: VertSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VertSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
