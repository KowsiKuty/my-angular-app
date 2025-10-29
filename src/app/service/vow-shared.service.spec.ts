import { TestBed } from '@angular/core/testing';

import { VowSharedService } from './vow-shared.service';

describe('VowSharedService', () => {
  let service: VowSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VowSharedService);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
