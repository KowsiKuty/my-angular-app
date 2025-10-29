import { TestBed } from '@angular/core/testing';
import { VfmService } from './vfm.service';

describe('VfmService', () => {
  let service: VfmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VfmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
