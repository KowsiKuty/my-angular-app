import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorarchivalComponent } from './vendorarchival.component';

describe('VendorarchivalComponent', () => {
  let component: VendorarchivalComponent;
  let fixture: ComponentFixture<VendorarchivalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorarchivalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorarchivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
