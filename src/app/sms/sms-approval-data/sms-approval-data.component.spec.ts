import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsApprovalDataComponent } from './sms-approval-data.component';

describe('SmsApprovalDataComponent', () => {
  let component: SmsApprovalDataComponent;
  let fixture: ComponentFixture<SmsApprovalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsApprovalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsApprovalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
