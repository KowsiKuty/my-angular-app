import { TestBed } from '@angular/core/testing';

import { TqService } from './tq.service';

describe('TqService', () => {
  let service: TqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
