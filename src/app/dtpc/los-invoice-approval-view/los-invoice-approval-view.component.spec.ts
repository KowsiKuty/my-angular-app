import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosInvoiceApprovalViewComponent } from './los-invoice-approval-view.component';

describe('LosInvoiceApprovalViewComponent', () => {
  let component: LosInvoiceApprovalViewComponent;
  let fixture: ComponentFixture<LosInvoiceApprovalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosInvoiceApprovalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosInvoiceApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
