import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsRenewalCreateComponent } from './sms-renewal-create.component';

describe('SmsRenewalCreateComponent', () => {
  let component: SmsRenewalCreateComponent;
  let fixture: ComponentFixture<SmsRenewalCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsRenewalCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsRenewalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
