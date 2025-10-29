import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeAssignSummaryComponent } from './barcode-assign-summary.component';

describe('BarcodeAssignSummaryComponent', () => {
  let component: BarcodeAssignSummaryComponent;
  let fixture: ComponentFixture<BarcodeAssignSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeAssignSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeAssignSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
