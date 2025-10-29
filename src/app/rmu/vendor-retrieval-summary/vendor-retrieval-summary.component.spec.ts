import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRetrievalSummaryComponent } from './vendor-retrieval-summary.component';

describe('VendorRetrievalSummaryComponent', () => {
  let component: VendorRetrievalSummaryComponent;
  let fixture: ComponentFixture<VendorRetrievalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRetrievalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorRetrievalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
