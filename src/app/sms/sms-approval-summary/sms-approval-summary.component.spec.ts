import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsApprovalSummaryComponent } from './sms-approval-summary.component';

describe('SmsApprovalSummaryComponent', () => {
  let component: SmsApprovalSummaryComponent;
  let fixture: ComponentFixture<SmsApprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsApprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsApprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
