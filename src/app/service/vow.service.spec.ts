import { TestBed } from '@angular/core/testing';

import { VowService } from './vow.service';

describe('VowService', () => {
  let service: VowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VowService);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
