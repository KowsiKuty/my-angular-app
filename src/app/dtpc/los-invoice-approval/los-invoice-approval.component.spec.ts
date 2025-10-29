import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosInvoiceApprovalComponent } from './los-invoice-approval.component';

describe('LosInvoiceApprovalComponent', () => {
  let component: LosInvoiceApprovalComponent;
  let fixture: ComponentFixture<LosInvoiceApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosInvoiceApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosInvoiceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
