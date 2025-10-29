import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrBranchQuotationComponent } from './pr-branch-quotation.component';

describe('PrBranchQuotationComponent', () => {
  let component: PrBranchQuotationComponent;
  let fixture: ComponentFixture<PrBranchQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrBranchQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrBranchQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
