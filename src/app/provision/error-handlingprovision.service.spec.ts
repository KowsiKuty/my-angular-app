import { TestBed } from '@angular/core/testing';
import { ErrorHandlingprovisionService } from './error-handlingprovision.service';

describe('ErrorHandlingprovisionService', () => {
  let service: ErrorHandlingprovisionService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlingprovisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
