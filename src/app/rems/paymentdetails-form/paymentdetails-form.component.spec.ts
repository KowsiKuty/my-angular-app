import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentdetailsFormComponent } from './paymentdetails-form.component';

describe('PaymentdetailsFormComponent', () => {
  let component: PaymentdetailsFormComponent;
  let fixture: ComponentFixture<PaymentdetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentdetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentdetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
