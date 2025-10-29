import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAllocationHistoryComponent } from './vendor-allocation-history.component';

describe('VendorAllocationHistoryComponent', () => {
  let component: VendorAllocationHistoryComponent;
  let fixture: ComponentFixture<VendorAllocationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAllocationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAllocationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
