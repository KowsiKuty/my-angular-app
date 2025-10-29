import { TestBed } from '@angular/core/testing';

import { AssetDetailsServiceService } from './asset-details-service.service';

describe('AssetDetailsServiceService', () => {
  let service: AssetDetailsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetDetailsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
