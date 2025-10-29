import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrQuotationComponent } from './pr-quotation.component';

describe('PrQuotationComponent', () => {
  let component: PrQuotationComponent;
  let fixture: ComponentFixture<PrQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
