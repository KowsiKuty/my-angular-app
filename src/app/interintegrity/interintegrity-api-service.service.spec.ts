import { TestBed } from '@angular/core/testing';

import { InterintegrityApiServiceService } from './interintegrity-api-service.service';

describe('InterintegrityApiServiceService', () => {
  let service: InterintegrityApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterintegrityApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
