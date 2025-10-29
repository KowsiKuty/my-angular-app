import { TestBed } from '@angular/core/testing';

import { JwService } from './jw.service';

describe('JwService', () => {
  let service: JwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
