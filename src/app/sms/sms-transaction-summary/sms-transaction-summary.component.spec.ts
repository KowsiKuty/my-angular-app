import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTransactionSummaryComponent } from './sms-transaction-summary.component';

describe('SmsTransactionSummaryComponent', () => {
  let component: SmsTransactionSummaryComponent;
  let fixture: ComponentFixture<SmsTransactionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsTransactionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsTransactionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
