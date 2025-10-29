import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosInvoiceSummaryComponent } from './los-invoice-summary.component';

describe('LosInvoiceSummaryComponent', () => {
  let component: LosInvoiceSummaryComponent;
  let fixture: ComponentFixture<LosInvoiceSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosInvoiceSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosInvoiceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
