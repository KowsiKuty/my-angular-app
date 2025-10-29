import { TestBed } from '@angular/core/testing';
import { ProisionshareserviceService } from './proisionshareservice.service';
describe('ProisionshareserviceService', () => {
  let service: ProisionshareserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProisionshareserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

