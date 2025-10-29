import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentfreezereportComponent } from './paymentfreezereport.component';

describe('PaymentfreezereportComponent', () => {
  let component: PaymentfreezereportComponent;
  let fixture: ComponentFixture<PaymentfreezereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentfreezereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentfreezereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
