import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentQSummaryComponent } from './payment-q-summary.component';

describe('PaymentQSummaryComponent', () => {
  let component: PaymentQSummaryComponent;
  let fixture: ComponentFixture<PaymentQSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentQSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentQSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
