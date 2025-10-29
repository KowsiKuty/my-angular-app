import { TestBed } from '@angular/core/testing';

import { SmsShareService } from './sms-share.service';

describe('SmsShareService', () => {
  let service: SmsShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmsShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
