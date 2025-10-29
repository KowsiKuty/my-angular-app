import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EledetailPaymentSummaryComponent } from './eledetail-payment-summary.component';

describe('EledetailPaymentSummaryComponent', () => {
  let component: EledetailPaymentSummaryComponent;
  let fixture: ComponentFixture<EledetailPaymentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EledetailPaymentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EledetailPaymentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
