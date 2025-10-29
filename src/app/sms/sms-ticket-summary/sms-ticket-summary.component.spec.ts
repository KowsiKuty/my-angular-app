import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTicketSummaryComponent } from './sms-ticket-summary.component';

describe('SmsTicketSummaryComponent', () => {
  let component: SmsTicketSummaryComponent;
  let fixture: ComponentFixture<SmsTicketSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsTicketSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsTicketSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
