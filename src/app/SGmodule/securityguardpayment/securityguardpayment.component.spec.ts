import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityguardpaymentComponent } from './securityguardpayment.component';

describe('SecurityguardpaymentComponent', () => {
  let component: SecurityguardpaymentComponent;
  let fixture: ComponentFixture<SecurityguardpaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityguardpaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityguardpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
