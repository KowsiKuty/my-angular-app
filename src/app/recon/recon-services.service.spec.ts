import { TestBed } from '@angular/core/testing';

import { ReconServicesService } from './recon-services.service';

describe('ReconServicesService', () => {
  let service: ReconServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
