import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeRequestSummaryComponent } from './barcode-request-summary.component';

describe('BarcodeRequestSummaryComponent', () => {
  let component: BarcodeRequestSummaryComponent;
  let fixture: ComponentFixture<BarcodeRequestSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeRequestSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeRequestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
